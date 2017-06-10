/**
 * Country Controller contains methods to interface with the seabiscuit race day database
 */

var Country = require('../models/Country'),
    Promise = require('bluebird');

// Promisify all methods in the Country Model Object instance.
Promise.promisifyAll(Country);

var controller = (function() {
    /**
     * Creates a country entity using the Country Name String passed.
     * 
     * @param {String} countryName The Country Name
     */
    function create(countryName) {
        return new Promise(function( resolve, reject ) {
            Country.createAsync({name : countryName}) // TODO: Need to handle betting data here
            .then(function( country ) {
                resolve(country)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    }
     /**
     * Finds a country using the parameters passed.
     * 
     * @param {String} params The Search term
     */
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
    /**
     * Finds a country using the unique ID passed.
     * 
     * @param {String} id The ID of a country entity
     */
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
    /**
     * Updates the Country Entity using the PA Betting or Racecard Object passed.
     * 
     * @param {Object} data The PA Betting or Racecard Object
     * @param {Object} countryEntity The Country Entity Object
     */
    function update( data, countryEntity ) {
        return new Promise(function( resolve, reject ) {
            var updateDocument = {}
            updateDocument = {
                $push: { meetings: data }
            }
            if ( data.meetingUpdate ) {
                updateDocument = {
                    $push: { meetings : data.meetingEntity }
                }
            }
            Country.findOneAndUpdateAsync(
                { _id : countryEntity._id },
                updateDocument,
                { new : true }
            )
            .then(function( country ) {
                resolve(country)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    }
    var controller = {
        create: create,
        find: find,
        findById: findById,
        update: update
    }
    return controller
}());

module.exports = controller
