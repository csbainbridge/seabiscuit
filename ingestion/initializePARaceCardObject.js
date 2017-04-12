var fs = require('fs');
var Promise = require('bluebird');
var setPARaceCardValues = require('./SetPARaceCardValues').setPARaceCardValues;


// For testing purposes
var util = require('util');

var initializePARaceCardObject = {

	createPARaceCardObject : function () {
		var obj = {
			"SeabiscuitPARaceCardSpecification" : "v0.111042017",
			"PARaceCardObject" : {
				"ObjectCreationTime" : new Date()
										.toISOString()
										.slice(0, 19)
										.replace(/[:-]/g, ''),
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
		return obj;
	},
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