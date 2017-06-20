var Notification = require('../models/Notification'),
    Promise = require('bluebird'),
    handleError = require('../utils/ErrorHandler').error;

Promise.promisifyAll(Notification);

module.exports = {
    create: function( raceEntity ) {
        console.log(raceEntity)
        return new Promise(function( resolve, reject ) {
            var document = {
                notifications: {
                    name: "RaceCardProcessed",
                    timestamp: new Date()
                },
                _raceref: raceEntity._id
            }
            Notification.createAsync(document)
            .then(function( notification ) {
                resolve(notification)
            })
            .catch(function( error ) {
                console.log(error)
                reject(error)
                return
            })
        })
    },
    update: function( id ) {
        
    },
    find: function( params ) {
        return new Promise(function( resolve, reject ) {
            Notification.findAsync(params)
            .then(function( notifications ) {
                resolve(notifications)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
    findById: function( id ) {
        //find based on id
    },
    delete: function( id ) {
        //delete based on id passed
    }
}