var Country = require('../models/Country');
var Promise = require('bluebird');
Promise.promisifyAll(Country);

/**
 * CRUD
 * Never mix with another controller but can use methods from the same controller
 */

var controller = (function() {
    function create(data) {
        return new Promise(function( resolve, reject ) {
            Country.createAsync({ name: data.PARaceCardObject.Meeting.Country }) // TODO: Need to handle betting data here
            .then(function(country){
                resolve(country)
            })
            .catch(function(error) {
                reject(error)
                return
            })
        })
    }
    function find( params ) {
        return new Promise(function( resolve, reject ) {
            Country.findAsync(params)
            .then(function( countries ) {
                resolve(countries)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    }
    function findById( id ) {
        return new Promise(function( resolve, reject ) {
            Country.findByIdAsync(id)
            .then(function( country ) {
                resolve(country)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    }
    function update( data, countryEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            updateDocument = {
                $push: { meetings: data }
            }
            if ( data.meetingUpdate ) {
                console.log("Log: Meeting Update")
                updateDocument = {
                    $push: { meetings: data.meetingEntity }
                }
            }
            Country.findOneAndUpdateAsync(
                { _id: countryEntity._id },
                updateDocument,
                { new: true }
            )
            .then(function( country ) {
                resolve(country)
            })
            .catch(function( error ) {
                reject(error)
            })
        })
    }
    function remove() {

    }
    var controller = {
        create: create,
        find: find,
        findById: findById,
        update: update,
        remove: remove 
    }
    return controller
}());

module.exports = controller
