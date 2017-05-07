/**
 * InitializePABettingObject initializes a JSON object used to store in the standardization process.
 */

/**
 * Dependencies
 * @bluebird, @SetPARaceCardValues, @IngestionUtils
 */
var Promise = require('bluebird'),
	setSABettingValues = require('./SetSABettingValues').setMessageValues,
	timestamp = require('./IngestionUtils').createTimeStamp;
	utils = require('util');


var initializeBettingObject = {
	/**
	 * Returns a paBettingObject
	 * 
	 * @returns {Object} Returns the paBettingObject
	 */
	createPABettingObject : function() {
		return {
			"SeabiscuitPABettingSpecification" : "v0.107042017",
			"PABettingObject" : {
				"ObjectCreationTime" : timestamp(),
				"Revision" : "",
				"MessageType" : "",
				"Meeting" : {
					"ID" : "",
					"Course" : "",
					"Country" : "",
					"Date" : "",
					"Status" : "",
					"Weather" : "",
					"Going" : "",
					"Race" : {
						"ID" : "",
						"Status" : "",
						"StatusTimeStamp" : "",
						"Time" : "",
						"Runners" : "",
						"Stewards" : "",
						"Objection" : "",
						"OffTime" : "",
						"WinningTime" : "",
						"Horse" : [],
						"Returns" : [],
					},
				},
			}
		}
	},
	/**
	 * Validates if the supplied bettingObject is a valid (expected) format.
	 * 
	 * @param {Object} bettingObject The bettingObject with supplied betting data.
	 * @returns {Object} Returns an object stating the validity of the @bettingObject
	 */
	checkBettingObjectType : function( bettingObject ) {
		var parsedJson = JSON.parse( bettingObject );
		if ( !parsedJson.HorseRacingX ) {
			return {
				"Flag" : false,
				Data : {
					"Error" : "Unrecognized Betting Object",
					"Action" : "Please check the XML data sent from the supplier",
				}
			}
		} else if ( parsedJson.HorseRacingX ) {
			return {
				"Flag" : true,
				"Data" : {
					"BettingObject" : parsedJson,
					"CountryCode": "SA",
				}
			}
		}
	},
	/**
	 * Returns a {Promise} rejects invalid data supplied and resolves with standardized pa betting data.
	 * 
	 * @param {Object} bettingObject The bettingObject with supplied betting data.
	 * @returns {Promise} Returns a Promise with pa betting data or an error depending on the validity of the supplied data.
	 */
	init : function( bettingObject ) {
		return new Promise(function( resolve, reject ) {
			var isValid = initializeBettingObject.checkBettingObjectType(bettingObject);
			if ( isValid.Flag === false ) {
				reject(isValid.Data)
			}
			var bettingDataObjects = {
				"BettingDataObject" : isValid.Data.BettingObject,
				"CountryCode" : isValid.Data.CountryCode,
				"PAObject" : initializeBettingObject.createPABettingObject()
			}
			resolve(bettingDataObjects);
		});
	},
}

module.exports = initializeBettingObject;
