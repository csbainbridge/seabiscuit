/**
 * Horse Controller contains methods to interface with seabiscuit race data database.
 */

var Horse = require('../models/Horse'),
    Promise = require('bluebird')

// Promisfy all method in the Horse Model Object instance.
Promise.promisifyAll(Horse)

module.exports = {
    /**
     * Creates a horse entity that belongs to a specific race using the PA Racecard Object passed.
     * 
     * @param {Object} data The PA Racecard Object.
     * @param {Object} raceEntity The Race Entity Object.
     */
    create: function( data, raceEntity ) {
        return new Promise(function( resolve, reject ) {
            var document = {
                _raceref: raceEntity._id,
                statuses: {
                    status: 'Runner'
                },
                name: data.Name,
                bred: data.Bred,
                cloth: data.Cloth,
                drawn: data.Drawn,
                weight: {
                    units: data.Weight.Units,
                    value: data.Weight.Value
                },
                jockeys: {
                    name: data.Jockey.Name,
                    allowance: {
                        units: data.Jockey.Allowance.Units,
                        value: data.Jockey.Allowance.Value
                    }
                }
            }
            Horse.createAsync(document)
            .then(function( horse ) {
                resolve(horse)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
    /**
     * Finds a horse using the parameters passed.
     * 
     * @param {String} params The Search term
     */
    find: function( params ) {
        return new Promise(function( resolve, reject ) {
            Horse.findAsync(params)
            .then(function( horses ) {
                resolve(horses)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
    /**
     * Finds a horse using the unique ID passed.
     * 
     * @param {String} id the ID of a horse entity
     */
    findById: function( id ) {
        return new Promise(function( resolve, reject ) {
            Horse.findByIdAsync(id)
            .then(function( horse ) {
                resolve(horse)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
    /**
     * Updates a Horse Entity based on the data passed in the PA Betting Object.
     * 
     * @param {Object} data The PA Betting Object
     * @param {Object} horse The Horse Object
     * @param {Object} horseEntity The Horse Entity Object
     */
    bettingUpdate: function( data, horse, horseEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            if ( data.PABettingObject.Meeting.Country === "South Africa" ) {
                switch(data.PABettingObject.MessageType) {
                    case "NonRunner":
                        updateDocument = {
                            $push: {
                                statuses: {
                                    status: "NonRunner"
                                }
                            }
                        }
                        break;
                    case "Market":
                        updateDocument = {
                            $push: {
                                shows: {
                                    supplier_timestamp: horse.Show.TimeStamp,
                                    numerator: horse.Show.Numerator,
                                    denominator: horse.Show.Denominator,
                                    offer: horse.Show.Offer
                                }
                            }
                        }
                        break;
                    case "Show":
                        updateDocument = {
                            $push: {
                                shows: {
                                    supplier_timestamp: horse.Show.TimeStamp,
                                    numerator: horse.Show.Numerator,
                                    denominator: horse.Show.Denominator,
                                    offer: horse.Show.Offer
                                }
                            }
                        }
                        break;
                    case "JockeyChange":
                        updateDocument = {
                            $push: {
                                jockeys: {
                                    allowance: {
                                        value: horse.Jockey.Allowance.Value,
                                        units: horse.Jockey.Allowance.Units,
                                    },
                                    overweight: {
                                        value: horse.Jockey.Overweight.Value,
                                        units: horse.Jockey.Overweight.Units
                                    },
                                    name: horse.Jockey.Name,
                                }
                            }
                        }
                        break;
                    case "Withdrawn":
                        updateDocument = {
                            $push: {
                                statuses: {
                                    status: "Withdrawn"
                                }
                            }
                        }
                        break;
                    case "Result":
                        updateDocument = {
                            starting_price: {
                                numerator: horse.StartingPrice.Numerator,
                                denominator: horse.StartingPrice.Denominator,
                            },
                            result: {
                                position: horse.Result.FinishPos,
                                disqualified: horse.Result.Disqualified,
                                amended_position: horse.Result.AmendedPos,
                                btn_distance: horse.Result.BtnDistance,
                            }
                        }
                        break;
                }
            }
            Horse.findOneAndUpdateAsync(
                { _id: horseEntity._id },
                updateDocument,
                { new: true }
            )
            .then(function( horse ) {
                resolve(horse)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
     /**
     * Updates a Horse Entity based on the data passed in the PA Racecard Object.
     * 
     * @param {Object} data The PA Racecard Object
     * @param {Object} horseEntity The Horse Entity Object
     */
    update: function( data, horseEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            if ( data.Jockey.Name !== horseEntity.jockeys[horseEntity.jockeys.length - 1].name ) {
                updateDocument = {
                $push: { 
                        jockeys: {
                            name: data.Jockey.Name,
                            allowance: {
                                units: data.Jockey.Allowance.Units,
                                value: data.Jockey.Allowance.Value
                            }
                        }
                    }
                }
            }
            Horse.findOneAndUpdateAsync(
                { _id: horseEntity._id },
                updateDocument,
                { new: true }
            )
            .then(function( horse ) {
                resolve(horse)
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