var Notification = require('../models/Notification'),
    Promise = require('bluebird'),
    handleError = require('../utils/ErrorHandler').error;

Promise.promisifyAll(Notification);

module.exports = {
    create: function( raceEntity ) {
        return new Promise(function( resolve, reject ) {
            Notification.createAsync({ _raceref: raceEntity._id })
            .then(function( notification ) {
                resolve(notification)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
    update: function( params ) {
        // Need to pass the notification log id and notification id
        //https://stackoverflow.com/questions/38507838/how-to-update-a-specific-object-in-a-array-of-objects-in-node-js-and-mongoose
        return new Promise(function( resolve, reject ) {
            if ( params.isCheckedUpdate === false ) {
                var updateDocument = {
                    $push: {
                        notifications: {
                            name: params.data.PABettingObject.MessageType,
                            timestamp: new Date()
                        }
                    }
                }
                Notification.findOneAndUpdate(
                    { _raceref: params.raceEntity._id },
                    updateDocument,
                    { new: true }
                )
                .then(function( notification ) {
                    resolve(notification)
                    return
                })
                .catch(function( error ) {
                    reject(error)
                    return
                })
            }
        })
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