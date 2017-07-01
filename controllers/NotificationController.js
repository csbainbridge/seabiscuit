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
    // TODO: Set the notification type to either jockey, show, status,
    // TODO: Test the switch statement
    // Would it be better if we separated these into two different functions one for notification updates, and the other for notification view updates.
    // It would remove the need for the additional if statement, can just call each function directly.
    update: function( params ) {
        return new Promise(function( resolve, reject ) {
            var documentToUpdate = {};
            var updateDocument = {};
            // Is this a notification viewed update?
            if ( params.isCheckedUpdate === false ) {
                // Is the notification entity type a race or meeting?
                if ( params.notificationEntityType === "race" ) {
                    var notificationMessageType = {};
                    // What is the message type?
                    switch(params.data.PABettingObject.MessageType) {
                        case "Market":
                            notificationMessageType = "show"
                            break;
                        case "Show":
                            notificationMessageType = "show"
                            break;
                        case "JockeyChange":
                            notificationMessageType = "jockey_change"
                            break;
                        case "Result":
                            notificationMessageType = "result"
                            break;
                        default:
                            break;
                    }
                    documentToUpdate = {
                        _raceref: params.raceEntity._id
                    }
                    updateDocument = {
                        $push: {
                            notifications: {
                                name: params.data.PABettingObject.MessageType,
                                timestamp: new Date()
                            }
                        }
                    }
                    // Merge update documents
                    updateDocument = Object.assign(notificationMessageType, updateDocument)
                    console.log(updateDocument)
                } else {
                    documentToUpdate = {
                        _meetingref: params.meetingEntity._id
                    }
                    updateDocument = {
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
                    // Iterate over each notification and if the notification has not been check
                    // If we are going to use individual tab notifications then we will need to check the notificationMessageType as well as the _isChecked value
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