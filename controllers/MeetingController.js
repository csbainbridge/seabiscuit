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
    create: function(data, countryDocument) {
        return new Promise(function( resolve, reject ) {
            var document = {
                _country: countryDocument._id,
                x_reference: data.Meeting.ID,
                course: data.Meeting.Course,
                date: data.Meeting.Date,
                going: data.Meeting.Going,
            }
            Meeting.createAsync(document)
            .then(function(meeting){
                resolve(meeting)
            })
            .catch(function(error){
                reject(error)
            })
        })
    },
    find: function(params) {
        return new Promise(function( resolve, reject ) {
            Meeting.findAsync(params)
            .then(function(meetings) {
                resolve(meetings) 
            })
            .catch(function(error) {
                reject(error)
                return
            })
        })
    },
    findById: function( id ) {
        return new Promise(function(resolve, reject) {
            Meeting.findByIdAsync(id)
            .then(function( meeting ) {
                resolve(meeting)
            })
            .catch(function( error ){
                reject(error)
                return
            })
        })
    },
    update: function( data, meetingEntity ) {
        return new Promise(function( resolve, reject ) {
            var statusObject = {
                status: data.Meeting.Status // TODO: Will need to pass just the meeting object in (Otherwise PARaceCardObject and PABettingObject will not match)
            }
            Meeting.findOneAndUpdateAsync(
                { _id: meetingEntity._id },
                { $push: { statuses: statusObject} }, // TODO: This should be an argument of what to update?
                { new: true }
            )
            .then(function( meeting ){
                resolve(meeting)
            })
            .catch(function( error ){
                reject(error)
            })
        })
    },
    delete: function() {

    }
}