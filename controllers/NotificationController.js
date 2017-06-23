var Notification = require('../models/Notification'),
    Promise = require('bluebird'),
    handleError = require('../utils/ErrorHandler').error;

Promise.promisifyAll(Notification);

module.exports = {
    create: function( params ) {
        return new Promise(function( resolve, reject ) {
            var document = {}
            if ( params.notificationEntityType === 'race' ) {
                document = {
                    _raceref: params.entity._id
                }
            } else {
                document = {
                    _meetingref: params.entity._id
                }
            }
            Notification.createAsync(document)
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
        return new Promise(function( resolve, reject ) {
            if ( params.isCheckedUpdate === false ) {
                if ( params.notificationEntityType === "race" ) {
                    var documentToUpdate = {
                        _raceref: params.raceEntity._id
                    }
                    var updateDocument = {
                        $push: {
                            notifications: {
                                name: params.data.PABettingObject.MessageType,
                                timestamp: new Date()
                            }
                        }
                    }
                } else {
                    var documentToUpdate = {
                        _meetingref: params.meetingEntity._id
                    }
                    var updateDocument = {
                        $push: {
                            notifications: {
                                name: params.data.PABettingObject.MessageType,
                                timestamp: new Date()
                            }
                        }
                    }
                }
                Notification.findOneAndUpdate(
                    documentToUpdate,
                    updateDocument,
                    { new: true }
                )
                .then(function( notification ) {
                    resolve(notification)
                })
                .catch(function( error ) {
                    reject(error)
                    return
                })
            } else if ( params.isCheckedUpdate === true ) {
                if ( params.notificationEntityType === "race" ) {
                    var documentToUpdate = {
                        _raceref: params.entity._id
                    }
                } else {
                    var documentToUpdate = {
                        _meetingref: params.entity._id
                    }
                }
                Notification.findAsync(documentToUpdate)
                .then(function(notificationEntity){
                    notificationEntity["0"].notifications.forEach(function(notification){
                        if ( notification._isChecked === false ) {
                            notification._isChecked = true
                        }
                    })
                    resolve(notificationEntity["0"].save())

                })
                .catch(function(error){
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