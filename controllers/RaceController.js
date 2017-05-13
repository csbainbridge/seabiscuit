var Race = require('../models/Race');
var Promise = require('bluebird');
Promise.promisifyAll(Race)

module.exports = {
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
            // Push horse entity ids into the horses array
            if ( data.horseUpdate ) {
                updateDocument = {
                    $push: { horses: data.horseEntity }
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