var Race = require('../models/Race');
var Promise = require('bluebird');
var _ = require('underscore');
Promise.promisifyAll(Race)

var controller = {
    //TODO: Need to check if the object is empty
    revisionMap: new Map(),
    correctRevisionSequence: function( data, race, raceEntity ) {
        function iterateRevisions( revisions, race, raceEntity ) {
            _.each(revisions, function( revision, i ) {
                if ( data.PABettingObject.Revision === (revision.data.PABettingObject.Revision + 1) ) {
                    controller.bettingUpdate(revision.data, race, raceEntity)
                    revisions.splice(i, 1)
                    iterateRevisions(revisions, race, raceEntity)
                } else {
                    revisions.push(data)
                    controller.revisionMap.set(data.PABettingObject.Meeting.Race.ID, revisions)
                }
            })
        }
        // console.log(Object.keys(controller.revisionMap).length == 0)
        // console.log(controller.revisionMap)
        //TODO: DOES NOT WORK
        if ( Object.keys(controller.revisionMap).length === 0 ) {
            var key = data.PABettingObject.Meeting.Race.ID;
            var revisions = []
            revisions.push(data)
            controller.revisionMap.set(key, revisions)
            controller.bettingUpdate(data, race, raceEntity)
        } else {
            console.log(controller.revisionMap)
            console.log(data.PABettingObject.Meeting.Race.ID)
            controller.revisionMap.get(data.PABettingObject.Meeting.Race.ID)
            iterateRevisions(revisions, race, raceEntity)
        }
    },
    create: function( data, meetingEntity ) {
        return new Promise(function( resolve, reject ) {
            var document = {
                _meeting: meetingEntity._id,
                x_reference: data.ID,
                time: data.Time,
                title: data.Title,
                statuses: { 
                    status: "Dormant"
                },
                handicap: data.Handicap,
                race_type: data.RaceType,
                track_type: data.TrackType,
                trifecta: data.Trifecta,
                max_runners: data.MaxRunners,
                distance: data.Distance
            }
            Race.createAsync(document)
            .then(function( race ) {
                resolve(race)
            })
            .catch(function( error ) {
                reject(error)
            })
        })
    },
    find: function( params ) {
        return new Promise(function( resolve, reject ) {
            Race.findAsync(params)
            .then(function( races ) {
                resolve(races)
            })
            .catch(function( error ) {
                reject(error)
                return
            }) 
        })
    },
    findById: function( id ) {
        return new Promise(function( resolve, reject ) {
            Race.findByIdAsync(id)
            .then(function( race ) {
                resolve(race)
            })
            .catch(function( error ) {
                reject( error )
                return
            })
        })
    },
    bettingUpdate: function( data, race, raceEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            if ( data.PABettingObject.Meeting.Country === "South Africa" ) {
                switch(data.PABettingObject.MessageType) {
                    case "RaceState":
                        updateDocument = {
                            $push: {
                                statuses: {
                                    status: race.Status,
                                    supplier_timestamp: race.StatusTimeStamp
                                }
                            }  
                        }
                        break;
                    case "OffTime":
                        updateDocument = {
                            supplier_off_time: race.OffTime
                        }
                        break;
                    case "RaceDividends":
                        dividendArray = _.map(race.Returns, function( dividend ) {
                            return {
                                type: dividend.Type,
                                currency: dividend.Currency,
                                dividend: dividend.Dividend,
                                horses: dividend.Horse
                            }
                        })
                        updateDocument = {
                            $push: {
                                returns: {
                                    $each: dividendArray
                                }
                            }
                        }
                        break;
                    case "WinningTime":
                        updateDocument = {
                            winning_time: race.WinningTime
                        }
                        break;
                    case "Objection":
                        updateDocument = {
                            $push: {
                                statuses: {
                                    status: "Objection"
                                }
                            },
                            stewards: race.Objection
                        }
                        break;
                    case "Stewards":
                        updateDocument = {
                            $push: {
                                statuses: {
                                    status: "Stewards Inquiry"
                                }
                            },
                            stewards: race.Stewards
                        }
                        break;
                }
            }
            Race.findOneAndUpdateAsync(
                { _id: raceEntity._id },
                updateDocument,
                { new: true }
            )
            .then(function( race ) {
                resolve(race)
            })
            .catch(function( error ) {
                reject(error)
            })
        })
    },
    update: function( data, raceEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            updateDocument = {
                x_reference: data.ID,
                time: data.Time,
                title: data.Title,
                handicap: data.Handicap,
                race_type: data.RaceType,
                track_type: data.TrackType,
                trifecta: data.Trifecta,
                max_runners: data.MaxRunners,
                distance: data.Distance
            }
            if ( data.horseUpdate ) {
                updateDocument = {
                    $push: { 
                        horses: data.horseEntity 
                    }
                }
            }
            Race.findOneAndUpdateAsync(
                { _id: raceEntity._id },
                updateDocument,
                { new: true }
            )
            .then(function( race ) {
                resolve(race)
            })
            .catch(function( error ) {
                reject(error)
            })
        })

    },
    delete: function() {

    }
}

module.exports = controller;