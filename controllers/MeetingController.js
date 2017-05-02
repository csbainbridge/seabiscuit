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
    create: function() {
        
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
    update: function() {

    },
    delete: function() {

    }
}