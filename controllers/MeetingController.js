/**
 * Meeting Controller contains methods to interface with the seabiscuit race day database
 */

var Meeting = require('../models/Meeting'),
    Promise = require('bluebird');

// Promisfy all methods in the Meeting Model Object instance.
Promise.promisifyAll(Meeting)

module.exports = {
    /**
     * Creates a Meeting entity that belongs to a specific country using the PA Racecard Object passed.
     * 
     * @param {Object} data The PA Racecard Object
     * @param {Object} countryEntity The Country Entity Object
     */
    create: function( data, countryDocument ) {
        return new Promise(function( resolve, reject ) {
            var document = {
                _country: countryDocument._id,
                x_reference: data.Meeting.ID,
                course: data.Meeting.Course,
                date: data.Meeting.Date,
                going: data.Meeting.Going,
                statuses: { 
                    status: "Dormant"
                }
            }
            Meeting.createAsync(document)
            .then(function( meeting ) {
                resolve(meeting)
            })
            .catch(function( error ) {           
                reject(error)
                return
            })
        })
    },
    /**
     * Finds a meeting using the parameters passed.
     * 
     * @param {String} params The Search term 
     */
    find: function( params ) {
        return new Promise(function( resolve, reject ) {
            Meeting.findAsync(params)
            .then(function( meetings ) {
                resolve(meetings) 
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
     * @param {String} id The ID of a meeting entity
     */
    findById: function( id ) {
        return new Promise(function( resolve, reject ) {
            Meeting.findByIdAsync(id)
            .then(function( meeting ) {
                resolve(meeting)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
     /**
     * Updates a Meeting Entity based on the data passed in the PA Betting Object.
     * 
     * @param {Object} data The PA Betting Object
     * @param {Object} meetingEntity The Meeting Entity Object
     */
    bettingUpdate: function( data, meetingEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            if ( data.PABettingObject.Meeting.Country === "South Africa" ) {
                switch( data.PABettingObject.MessageType) {
                    case "Going":
                        updateDocument = {
                            going: data.PABettingObject.Meeting.Going
                        }
                        break;
                    case "Weather":
                        updateDocument = {
                            weather: data.PABettingObject.Meeting.Weather
                        }
                        break;
                }
            }
            Meeting.findOneAndUpdateAsync(
                { _id: meetingEntity._id },
                updateDocument,
                { new: true }
            )
            .then(function( meeting ) {
                resolve(meeting)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
     /**
     * Updates a Meeting Entity based on the data passed in the PA Racecard Object.
     * 
     * @param {Object} data The PA Racecard Object
     * @param {Object} meetingEntity The Meeting Entity Object
     */
    update: function( data, meetingEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            if ( meetingEntity.statuses.length === 0 ) {
                var statusObject = {
                    status: data.Meeting.Status
                }
                updateDocument = {
                    course: data.Meeting.Course,
                    date: data.Meeting.Date,
                    going: data.Meeting.Going,
                    $push: { 
                        statuses: statusObject
                    } 
                }
            } else if ( data.Meeting.Status !== meetingEntity.statuses[meetingEntity.statuses.length - 1].status ) {
                var statusObject = {
                    status: data.Meeting.Status
                }
                updateDocument = {
                    course: data.Meeting.Course,
                    date: data.Meeting.Date,
                    going: data.Meeting.Going,
                    $push: { 
                        statuses: statusObject
                    } 
                }
            } else {
                updateDocument = {
                    course: data.Meeting.Course,
                    date: data.Meeting.Date,
                    going: data.Meeting.Going
                }
            }
            Meeting.findOneAndUpdateAsync(
                { _id: meetingEntity._id },
                updateDocument,
                { new: true }
            )
            .then(function( meeting ) {
                resolve(meeting)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
     /**
     * Updates the array of race ids in the 
     * 
     * @param {Object} data The PA Racecard Object.
     */
    updateRaces: function( data, meetingEntity ) {
        return new Promise(function( resolve, reject ) {
            Meeting.findOneAndUpdateAsync(
                { _id: meetingEntity._id },
                { $push: { races: data } },
                { new: true }
            )
            .then(function( meeting ){
                resolve(meeting)
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    delete: function() {

    }
}