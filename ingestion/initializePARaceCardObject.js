/**
 * InitializePARaceCardObject initializes a JSON object used to store data in the standardization process.
 */

/**
 * Dependencies
 * @bluebird, 
 */
var Promise = require('bluebird'),
	setPARaceCardValues = require('./SetPARaceCardValues').setPARaceCardValues,
	timestamp = require('./IngestionUtils').createTimeStamp;

var initializeRaceCardObject = {
	/**
	 * Returns a paRaceCardObject.
	 * 
	 * @returns {Object} Returns the paRaceCardObject.
	 */
	createPARaceCardObject : function () {
		return {
			"SeabiscuitPARaceCardSpecification" : "v0.111042017",
			"PARaceCardObject" : {
				"ObjectCreationTime" : timestamp(),
				"Meeting" : {
					"ID" : "",
					"Course" : "",
					"Country" : "",
					"Date" : "",
					"Status" : "",
					"Going" : "",
					"Race" : [],
				},
			},
		}
	},
	/**
	 * Validates if the supplied racecardObject is a valid (expected) format.
	 * 
	 * @param {Object} raceCardObject The raceCardObject with supplied Race Card data.
	 * @returns {Promise} Returns an Promise that is resolved on the receipt of valid race card data.
	 */
	init : function( raceCardObject ) {
		return new Promise(function( resolve, reject ) {
			var parsedRaceCard = JSON.parse(raceCardObject)
			if ( !parsedRaceCard.HorseRacingCard ) {
				reject({
					"Error" : "Unrecognised Race Card Object",
					"Action" : "Please check that the format of the data sent from the data supplier has not changed",
				})
			}
			resolve({
				"RaceCardObject" : parsedRaceCard,
				"PAObject" : initializeRaceCardObject.createPARaceCardObject()
			})
		})
	}
}

module.exports = initializeRaceCardObject;