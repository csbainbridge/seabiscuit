var Race = require('../models/Race');
var Promise = require('bluebird');
Promise.promisifyAll(Race)

module.exports = {
    create: function( data, meetingEntity ) {
        return new Promise(function( resolve, reject ) {
            console.log(meetingEntity._id)
            var document = {
                _meeting: meetingEntity._id,
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
            console.log("LOG: Update Race")
            /**
             * TODO: This will need to dynamically update the entity values
             * depending on whether race card or betting data is passed.
             */
            // Update document for race card data
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
            Race.findOneAndUpdateAsync(
                { _id: raceEntity._id },
                updateDocument,
                { new: true }
            )
            .then(function( race ) {
                console.log(race)
            })
            .catch(function( error ) {
                console.log(error)
            })
        })

    },
    delete: function() {

    }
}