/*
	@@Imports
	Module is dependant on @fs.
*/
var fs = require('fs');
var Promise = require('bluebird');
var seabiscuitUtils = require('./utils');
var saMessageValueSetter = require('./SetSABettingValues').setMessageValues;
var saDefaultValueSetter = require('./SetSABettingValues').setDefaultValues;

// Testing Modules
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
		var obj = {
			"PABettingObject" : {
				"ObjectCreationTime" : seabiscuitUtils.createTimeStamp(),
				"Revision" : "",
				"MessageType" : "",
				"Meeting" : {
					"Course" : "",
					"Country" : "",
					"Date" : "",
					"Status" : "",
					"Race" : {
						"Status" : "",
						"Time" : "",
						"Runners" : "",
						"Weather" : "",
						"Going" : "",
						"OffTime" : "",
						"WinningTime" : "",
						"Horse" : [],
						"Returns" : [{
							"Type" : "",
							"Currency" : "",
							"Dividend" : "",
							"Horse" : {
								"Name" : "",
								"Bred" : "",
							},
						}],
					},
				},
			}
		}
		return obj;
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
		var objData = initializePABettingObject.checkBettingObjectType( bettingObject );
		var paObjectWithData = objData

		.then( function( object ) {
			var bettingDataObjects = {
				"BettingDataObject" : object.BettingObject,
				"ObjectType" : object.ObjectType,
				"PAObject" : initializePABettingObject.createPABettingObject()
			}
			// Returns standardized PA Betting Object
			return initializePABettingObject.checkObjectType( bettingDataObjects );
		})
		.catch( function( error ){
			throw error;
		})
		return paObjectWithData;
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
		
		// Check which supplier the betting data came from
		if ( bettingDataObjects.ObjectType === "SA" ) {
			saMessageValueSetter(messageType, paObject, bettingObject);
			saDefaultValueSetter(paObject, bettingObject);
		}
		// Return PA Betting object to the @standardizeJson function
		return paObject
	},
}

module.exports = initializePABettingObject;
