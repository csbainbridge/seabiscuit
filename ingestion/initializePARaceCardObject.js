/*
	@@InitializePARaceCardObject module
*/

/*
	@@Imports
	Module us dependant on @bluebird, @SetPARaceCardValues and @SAUtils.
*/
var Promise = require('bluebird');
var setPARaceCardValues = require('./SetPARaceCardValues').setPARaceCardValues;
var timestamp = require('./SAUtils').createTimeStamp;

// For testing purposes
var util = require('util');

/*
	@@InitializePARaceCardObject provides function @createPARaceCardObject, @checkRaceCardObjectType and @standardizeRaceCardData.
*/
var initializePARaceCardObject = {
	/*
		@createPARaceCardObject

		@desc - Returns an empty PA Race Card Object
	*/
	createPARaceCardObject : function () {
		var paRaceCardObject = {
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
		return paRaceCardObject;
	},
	/*
		@checkRaceCardObjectType
		@param raceCardObject - Supplier Race Card Object

		@desc - Returns a promise that confirms if the race card object supplied is a valid format.
	*/
	checkRaceCardObjectType : function( raceCardObject ) {
		parsedJson = JSON.parse( raceCardObject );
		return new Promise(function( resolve, reject ) {
			var error = "Unrecognized Race Card Object"
			if ( !parsedJson.HorseRacingCard ) {
				reject(
						{
							"Error" : error,
							"Action" : "Please check the XML data sent from the supplier",
						}
					);
			} else {
				resolve(parsedJson);
			}
		})
	},
	/*
		@standardizeRaceCardData
		@param raceCardObject

		@desc - Returns a promise that returns a standardized PA Race Card object or an error that has occured during the standardization process.
	*/
	standardizeRaceCardData : function( raceCardObject ) {
		return new Promise(function( resolve, reject ) {
			var objData = initializePARaceCardObject.checkRaceCardObjectType(raceCardObject);
			var paObjectWithData = objData
			.then(function( object ) {
				var raceCardDataObject = {
					"RaceCardObject" : object,
					"PAObject" : initializePARaceCardObject.createPARaceCardObject()
				}
				resolve(setPARaceCardValues(raceCardDataObject));
			})
			.catch(function( error ) {
				reject(error);
				return
			})
			return paObjectWithData
		});
	},
}

module.exports = initializePARaceCardObject;