/*
	@@Imports
	Module is dependant on @fs.
*/
var fs = require('fs');
var Promise = require('bluebird');
var setSABettingValues = require('./SetSABettingValues').setMessageValues;

// For testing purposes
var util = require('util');

/*
	@@initializePABettingObject object provides function @createPABettingObject, @checkBettingObjectType, @standardizeBettingData and @checkObject.
*/
var initializePABettingObject = {

	/*
	@createPABettingObject function
	Creates PABettingObject, and sets its values using the json data is was passed.
	*/
	createPABettingObject : function() {
		var paBettingObject = {
			"SeabiscuitPABettingSpecification" : "v0.107042017",
			"PABettingObject" : {
				"ObjectCreationTime" : new Date()
										.toISOString()
										.slice(0, 19)
										.replace(/[:-]/g, ''),
				"Revision" : "",
				"MessageType" : "",
				"Meeting" : {
					"ID" : "",
					"Course" : "",
					"Country" : "",
					"Date" : "",
					"Status" : "",
					"Race" : {
						"ID" : "",
						"Status" : "",
						"StatusTimeStamp" : "",
						"Time" : "",
						"Runners" : "",
						"Weather" : "",
						"Going" : "",
						"OffTime" : "",
						"WinningTime" : "",
						"Horse" : [],
						"Returns" : [],
					},
				},
			}
		}
		return paBettingObject;
	},

	/*
		@checkBettingObjectType function
		@params json
		Checks the structure of the JSON betting object it was passed and returns a Promise to its caller

		@Resolve returns an object containing the JSON betting object and Object Type which is a country code based of the supplier of the data
		For example, data from South African supplier returns country code "SA" to the caller.
		@Reject returns as error if the structure of the JSON betting object is unrecognized.
	*/
	checkBettingObjectType : function( bettingObject ) {
		var parsedJson = JSON.parse( bettingObject );
		return new Promise(function( resolve, reject ) {
			var error = "Unrecognized Betting Object"
			if ( !parsedJson.HorseRacingX ) {
				reject({
					"Error" : error,
					"Action" : "Please check the XML data sent from the supplier",
				});
				return
			} else if ( parsedJson.HorseRacingX ) {
				resolve({
					"BettingObject" : parsedJson,
					"ObjectType": "SA",
				})
			}
		});
	},

	/*
		@standardizeBettingData function
		@params bettingObject
		Function uses @checkBettingObjectType and @createPABettingObject to create a standardized PA Betting Object and returns it to its caller
	*/
	standardizeBettingData : function( bettingObject ) {
		return new Promise(function( resolve, reject ) {

			var objData = initializePABettingObject.checkBettingObjectType(bettingObject);
			var paObjectWithData = objData

			.then( function( object ) {
				var bettingDataObjects = {
					"BettingDataObject" : object.BettingObject,
					"ObjectType" : object.ObjectType,
					"PAObject" : initializePABettingObject.createPABettingObject()
				}
				// Returns standardized PA Betting Object
				resolve(initializePABettingObject.checkObjectType(bettingDataObjects));
			})
			.catch( function( error ){
				reject(error);
				return
			})
			return paObjectWithData;
		});
	},

	/*
		@checkObjectType function
		@params bettingDataObjects {Object that contains data to construct standardised PA Betting Object}
		Function determines which supplier the object is from using @ObjectType and returns standardizezed PA Betting object.
	*/
	checkObjectType : function( bettingDataObjects ) {
		// Error handling for the type of object is already executed in @checkBettingObjectType function.
		console.log(util.inspect(bettingDataObjects.BettingDataObject, false, null));
		var paObject = bettingDataObjects.PAObject;
		var bettingObject = bettingDataObjects.BettingDataObject;
		var messageType = bettingDataObjects.BettingDataObject.HorseRacingX.Message["0"].$.type;
		var countryCode = bettingDataObjects.ObjectType;
		
		// Check which supplier the betting data came from
		if ( countryCode === "SA" ) {
			setSABettingValues(messageType, paObject, bettingObject, countryCode);
			// saDefaultValueSetter(paObject, bettingObject);
		}
		// Return PA Betting object to the @standardizeJson function
		return paObject
	},
}

module.exports = initializePABettingObject;
