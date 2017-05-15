/*
* CountryPostHandler handles race card and betting Country data from POST request to route localhost:3000/country?name=country_name_value
*/

/**
 * Dependencies
 * @underscore, @CountryController
 */
var _ = require('underscore'),
    handleError = require('../utils/ErrorHandler').error,
    countryController = require('../controllers').country;

module.exports = (function() {
    /**
     * Module globals
     * query - The POST request query (Example: ?name=South+Africa)
     * data - The JSON data (Example: PA Betting Object or PA Race Card Object)
     * controller - The country controller to interface with the data store
     */
    var query;
    var data;
    var controller;
    /**
     * Checks if the entities array contains any entity objects. 
     * When no entities exist creates a country entity.
     * 
     * @param {Array} entities The array of entities
     */
    function doesEntityExist( entities ) {
        if ( entities.length === 0 ) {
            return countryPostHandler.controller
            .create(countryPostHandler.data)
            .catch(handleError)
        } else {
            return entities["0"]
        }
    }
    /**
     * Uses the country controller to update the meetings array in the country entity
     * 
     * @param {Object} meeting The meeting entity
     * @param {Object} countryEntity The country entity
     */
    function updateMeetingsArray( meeting, countryEntity ) {
        countryController.update({
            "meetingUpdate": true,
            "meetingEntity": meeting,
        }, countryEntity["0"])
    }

    // TODO: Need to sort out when multiple files are POSTed at the same time their names
    // are set to the same value. All other data is saved correctly to the database. 
    // I think that this may be due to the fact that 

    /**
     * Checks and updates the meetings array of the country entity.
     * 
     * @param {Object} meeting The meeting entity
     * @param {Object} countryEntity The country entity
     */
    function checkIfCountryHasMeetings( meeting, countryEntity ) {
        if ( countryEntity["0"].meetings.length === 0 ) {
            updateMeetingsArray(meeting, countryEntity)
        } else {
            var meetingIdMap = new Map();
            _.each(countryEntity["0"].meetings, function( meetingId ) {
                 meetingIdMap.set(meetingId.toString(), meetingId.toString())
            })
            hasMeetingId = meetingIdMap.get(meeting._id.toString()) == meeting._id
            if ( !hasMeetingId ) {
                updateMeetingsArray(meeting, countryEntity)
            }
        }
    }
    function addMeetings( meetingPromise ) {
        meetingPromise.then(function( meeting ) {
            countryController.find({ _id: meeting._country })
            .then(checkIfCountryHasMeetings.bind(null, meeting))
            .catch(handleError)
        })
    }
    /**
     * Root function that sets module globals, and uses the controller and query to find the matching entity.
     * 
     * @param {Object} query The query from the POST request query
     * @param {Object} data The JSON object from the POST request body
     * @param {Object} controller The country controller
     */
    function checkEntities( query, data, controller ) {
        var response;
        countryPostHandler.query = query;
        countryPostHandler.data = data;
        countryPostHandler.controller = controller;
        response = countryPostHandler.controller
        .find(countryPostHandler.query)
        .then(doesEntityExist)
        .catch(handleError)
        return response;
    }
    /**
     * Object to return when module function is called.
     */
    var countryPostHandler = {
       checkEntities: checkEntities,
       query: query,
       data: data,
       controller: controller,
       addMeetings: addMeetings
    }
    return countryPostHandler;
}());