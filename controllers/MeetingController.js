var Meeting = require('../models/Meeting')
var Promise = require('bluebird');
Promise.promisifyAll(Meeting)

/**
 * CRUD
 * 
 * Create
 * Read
 * Update
 * Delete
 *  
 */

module.exports = {
    create: function( data, countryDocument ) {
        return new Promise(function( resolve, reject ) {
            var document = {
                _country: countryDocument._id,
                x_reference: data.Meeting.ID,
                course: data.Meeting.Course,
                date: data.Meeting.Date,
                going: data.Meeting.Going,
            }
            Meeting.createAsync(document)
            .then(function( meeting ) {
                resolve(meeting)
            })
            .catch(function( error ) {
                reject(error)
            })
        })
    },
    find: function( params ) {
        return new Promise(function( resolve, reject ) {
            Meeting.findAsync(params)
            .then(function( meetings ) {
                // console.log(meetings)
                resolve(meetings) 
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
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
                    $push: { statuses: statusObject} 
                }
            } else if ( data.Meeting.Status !== meetingEntity.statuses[meetingEntity.statuses.length - 1].status ) {
                var statusObject = {
                    status: data.Meeting.Status
                }
                updateDocument = {
                    course: data.Meeting.Course,
                    date: data.Meeting.Date,
                    going: data.Meeting.Going,
                    $push: { statuses: statusObject} 
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
            })
        })
    },
    updateRaces: function( data, meetingEntity ) {
        return new Promise(function( resolve, reject ) {
            Meeting.findOneAndUpdateAsync(
                { _id: meetingEntity._id },
                { $push: { races: data } },
                { new: true }
            )
            .then(function( meeting ){
                console.log(meeting)
            })
            .catch(function(error){
                console.log(error)
            })
        })
    },
    delete: function() {

    }
}