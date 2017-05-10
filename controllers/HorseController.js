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
    update: function( data, horseEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            //TODO: South African betting data - Need to use Case statement to this function
            // Racecard Updates
            // We don't need to repeat this code for race card and betting as the JSON object structure is the same
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