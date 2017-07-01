/**
 * Race Controller contains methods to interface with the seabiscuit race day database
 */

var Race = require('../models/Race'),
    Promise = require('bluebird'),
    handleError = require('../utils/ErrorHandler').error,
    _ = require('underscore');

// Promisfy all methods in the Meeting Model Object instance
Promise.promisifyAll(Race)

var controller = {
    /**
     * Creates a Race Entity that belongs to a specific meeting using the PA Racecard Object passed.
     * 
     * @param {Object} data The PA Racecard Object
     * @param {Object} meetingEntity The Country Entity Object
     */
    create: function( data, meetingEntity ) {
        return new Promise(function( resolve, reject ) {
            var document = {
                _meeting: meetingEntity._id,
                x_reference: data.ID,
                time: data.Time,
                title: data.Title,
                statuses: { status: "Dormant" },
                handicap: data.Handicap,
                race_type: data.RaceType,
                track_type: data.TrackType,
                trifecta: data.Trifecta,
                max_runners: data.MaxRunners,
                runners: data.MaxRunners,
                distance: data.Distance
            }
            Race.createAsync(document)
            .then(function( race ) {
                resolve(race)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
    /**
     * Finds a race using the parameters passed.
     * 
     * @param {String} params The Search term
     */
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
    /**
     * Finds a meeting using the unique ID passed.
     * 
     * @param {String} id The ID of a race entity
     */
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
    /**
     * Updates a Race Entity based on the data passed in the PA Betting Object.
     * 
     * @param {Object} data The PA Betting Object
     * @param {Object} race The race object
     * @param {Object} meetingEntity The Meeting Entity Object
     */
    bettingUpdate: function( data, race, raceEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            // If the data is South African check the message type
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
                    case "NonRunner":
                        updateDocument = {
                            runners: raceEntity.max_runners - race.Horse.length
                        }
                    break;
                }
                updateDocument.current_revision = parseInt(data.PABettingObject.Revision)
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
                    return
                })
            }
        })
    },
    /**
     * Updates a Race Entity based on the data passed in the PA Racecard Object
     * 
     * @param {Object} data The PA Racecard Object
     * @param {Object} raceEntity The Race Entity Object
     */
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
                return
            })
        })

    },
    delete: function() {

    }
}

module.exports = controller;