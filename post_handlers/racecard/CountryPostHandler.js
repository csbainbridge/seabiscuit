/*
* CountryPostHandler handles race card and betting Country data from POST request to route localhost:3000/country?name=country_name_value
*/

/**
 * Dependencies
 * @underscore, @CountryController
 */
var _ = require('underscore'),
    handleError = require('../../utils/ErrorHandler').error,
    countryController = require('../../controllers').country;

module.exports = (function() {
    /**
     * Uses the country controller to update the meetings array in the country entity
     * 
     * @param {Object} meeting The meeting entity
     * @param {Object} countryEntity The country entity
     */
    function updateMeetingsArray( meeting, countryEntity ) {
        countryController.update({"meetingUpdate" : true, "meetingEntity" : meeting}, countryEntity["0"])
    }
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
        return meetingPromise.then(function( meeting ) {
            return countryController.find({_id: meeting._country}).then(checkIfCountryHasMeetings.bind(null, meeting)).catch(handleError)
        })
    }
    /**
     * Root function that sets module globals, and uses the controller and query to find the matching entity.
     * 
     * @param {Object} query The query from the POST request query
     * @param {Object} data The JSON object from the POST request body
     * @param {Object} controller The country controller
     */
    function init( query, data, controller ) {
        return controller.find(query).catch(handleError)
    }
    /**
     * Object to return when module function is called.
     */
    var countryPostHandler = {
       init: init,
       addMeetings: addMeetings
    }
    return countryPostHandler;
}());