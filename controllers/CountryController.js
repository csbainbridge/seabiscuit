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
    //TODO: Create controller method called find and populate
    function find( params ) {
        return new Promise(function( resolve, reject ) {
            Country.findAsync(params)
            .then(function( countries ) {
                resolve(countries)
            })
            .catch(function( error ){
                reject(error)
                return
            })
        })
    }
    /**s
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
    //TODO: Need to call this function when using web sockets
    function findAndPopulate( params ) {
        return new Promise(function( resolve, reject ){
            Country.find(params)
            .populate("meetings")
            .exec(function(error, countries) {
                if ( error ) {
                    reject(error)
                    return
                }
                var options = {
                    path: "meetings.races",
                    model: "Race"
                }
                Country.populate(countries, options, function( error, races ) {
                    resolve(races)
                })
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
        findAndPopulate,
        update: update
    }
    return controller
}());

module.exports = controller
