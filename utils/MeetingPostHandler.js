/**
 * MeetingPostHandler handles race card and betting Meeting data from POST request to route localhost:3000/country?name=country_name_value
 */

/**
 * Dependencies
 * @MeetingController, @bluebird, @underscore
 */
var controller = require('../controllers').meeting,
    handleError = require('../utils/ErrorHandler').error,
    Promise = require('bluebird'),
    _ = require('underscore')

module.exports = (function() {
    /**
     * Module globals
     * data - The JSON data (Example: PA Betting Object or PA Race Card Object)
     */
    var data;
    /**
     * Uses the meeting controller to update the meeting entity with the JSON data object.
     * 
     * @param {Object} data The JSON data object (PA Betting or PA Race Card) 
     * @param {Array} meetingEntity 
     * @returns {Promise} Returns the promised meeting object.
     */
    function callUpdate( data, meetingEntity ) {
        // The controller.find(params) method returns an array containing horse entities.
        if ( Array.isArray(meetingEntity) ) {
            return controller.update(data, meetingEntity["0"])
        } else {
            // TODO: Test to see if the POST still works when this is removed.
            return meetingEntity.then(function( meetingEntity ) {
                return controller.update(data, meetingEntity)
            })
        }
    }
    /**
     * Checks if the meeting entity array contains any meeting objects.
     * When no entity exists creates a meeting entity.
     * When an entity already exists it is updated.
     * 
     * @param {Object} countryEntity 
     * @param {Object} meetingEntity 
     * @returns {Promise} Returns promised meeting object.
     */
    function doesMeetingExist( countryEntity, meetingEntity, data ) {
        if ( meetingEntity.length === 0 ) {
            entity = controller.create(data, countryEntity) // The global variable handler.data is always Turfontein which is why multiple model instances of turfontein meeting are added to the database.
            return entity
        } else {
            return callUpdate(data, meetingEntity)
        }
    }
    /**
     * Thens the country promise and returns the country entity object.
     * 
     * @param {Promise} promise Promise containg country entity
     * @returns {Object} Returns the country entity
     */
    function getCountry( promise ) {
        return promise.then(function( countryEntity ) {
            return countryEntity
        })
    }
    /**
     * Finds the meeting that corresponds the the race entity passed, then updates the races array of the meeting entity object.
     * 
     * @param {Object} raceEntity The race entity 
     */
    function getMeetingUsingRaceEntity( raceEntity ) {
        controller.find({_id: raceEntity._meeting})
        .then(function( meetingEntity ){
            if ( meetingEntity["0"].races.length === 0 ) {
                controller.updateRaces(raceEntity, meetingEntity["0"])
            }
        })
    }
    /**
     * Iterates over an array of promises, and passed the promised entity value to the getMeetingUsingRaceEntity function.
     * @param {Array} promises Array of meeting promises
     */
    function iterateRacePromises( promises ) {
        promises.forEach(function( promise ){
            promise.then(getMeetingUsingRaceEntity) // TODO: Test to see if this still works
            .catch(function( error ) {
                console.log("Error updating races array of meeting entity" + "\n\n" + error)
            })
        })
    }
    /**
     * Root function that sets the module global and gets the values from the object passed.
     * 
     * @param {Object} object The object containing the JSON racing data and the promised country object.
     * @returns {Promise} Returns the promised meeting entity object 
     */
    function init( object ) {
        var data = object.data.PARaceCardObject ? object.data.PARaceCardObject : object.data.PABettingObject;
        return Promise.all([
            getCountry(object.promise),
            controller.find({x_reference: data.Meeting.ID})
        ])
        .spread(function( countryEntity, meetingEntity ) {
            return doesMeetingExist(countryEntity, meetingEntity, data)
        })
        .catch(handleError)
    }
    /**
     * Object to return when the module function is called.
     */
    var handler = {
        init: init,
        iterateRacePromises: iterateRacePromises
    }
    return handler
}());