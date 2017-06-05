var Race = require('../models/Race');
var Promise = require('bluebird');
var _ = require('underscore');
Promise.promisifyAll(Race)

var controller = {
    revisionMap: new Map(),
    //NOTE: This still does not work when multiple betting files are sent out of sync and processed
    correctSequence: function ( data, race, raceEntity ) {
        if (controller.revisionMap.size > 0 ) {
            function checkIfPreviouslyProcessed(data, revisions, raceEntity, race) {
                var nextRevision = parseInt(data.PABettingObject.Revision) + 1
                if ( revisions.get(nextRevision.toString()) ) {
                    controller.bettingUpdate(data, data.PABettingObject.Meeting.Race, raceEntity)
                    revisions.delete(data.PABettingObject.Revision)
                    checkIfPreviouslyProcessed(revisions.get(nextRevision.toString()), revisions, raceEntity, race)
                } else {
                    controller.bettingUpdate(data, data.PABettingObject.Meeting.Race, raceEntity)
                    var deleteRevision = parseInt(data.PABettingObject.Revision) - 1
                    revisions.delete(deleteRevision.toString())
                    revisions.set(data.PABettingObject.Revision, data)
                    controller.revisionMap.set(data.PABettingObject.Meeting.Race.ID, revisions)
                }
            }
            function checkIfNextInSequence(data, revisions, raceEntity, race) {
                if ( parseInt(data.PABettingObject.Revision) === (raceEntity.sequence + 1) ) {
                    checkIfPreviouslyProcessed(data, revisions, raceEntity, race)
                } else {
                    revisions.set(data.PABettingObject.Revision, data)
                    controller.revisionMap.set(data.PABettingObject.Meeting.Race.ID, revisions)
                }
            }
            checkIfNextInSequence(data, controller.revisionMap.get(data.PABettingObject.Meeting.Race.ID), raceEntity, race)
        } else {
            var key = data.PABettingObject.Meeting.Race.ID;
            var revisions = new Map();
            revisions.set(data.PABettingObject.Revision, data);
            controller.revisionMap.set(key, revisions)
            controller.bettingUpdate(data, race, raceEntity)
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
            console.log(race)
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
                // if ( parseInt(data.PABettingObject.Revision) !== raceEntity.sequence + 1 ) {
                //     console.log("BETTING UPDATE failure @ " + new Date() + " " + "Error: Out of sync")
                // } else {
                    updateDocument.sequence = parseInt(data.PABettingObject.Revision)
                    console.log(updateDocument)
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
                    
                // }
            }
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