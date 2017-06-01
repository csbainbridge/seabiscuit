var Horse = require('../models/Horse');
var Promise = require('bluebird')
Promise.promisifyAll(Horse)

module.exports = {
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
            })
        })
    },
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
    //TODO: Complete this function, will need to use case statement to check the message type.
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
                // console.log(horse)
            })
            .catch(function( error ) {
                // console.log(error)
            })
        })
    },
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
            })
        })
    },
    delete: function() {
    }
}