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
            Country.createAsync({ name: data.PARaceCardObject.Meeting.Country })
            .then(function(country){
                resolve(country)
            })
            .catch(function(error) {
                reject(error)
                return
            })
        })
    }
    function find(params) {
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
    function findById(id) {
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
    function update() {

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
