/*
	@@Imports
	Module is dependant on @fs.
*/
var fs = require('fs');
var Promise = require ('bluebird');

/*
	@@standardizeJson object provides function @createPABettingObject.
*/
var initializePABettingObject = {
	/*
	@createPABettingObject function
	Creates PABettingObject, and sets its values using the json data is was passed.
	*/
	createPABettingObject : function() {
		// TODO: Promise this function
		var obj = {
			"PABettingObject" : {
				"Revision" : "",
				"MessageType" : "",
				"Meeting" : {
					"Course" : "",
					"Country" : "",
					"Date" : "",
					"Status" : "",
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
		var parsedJson = JSON.parse(bettingObject);
		return new Promise(function( resolve, reject ) {
			if ( !parsedJson.HorseRacingX ) {
				reject("Unrecognised Betting Object: Please check the structure of the XML data received from the supplier.");
				return
			} else if ( parsedJson.HorseRacingX ) {
				resolve({ 
					"BettingObject" : parsedJson, 
					"ObjectType": "SA",
					"paObject" : initializePABettingObject.createPABettingObject()
				} )
			}
		});
	},

	/*
		@standardizeJson function
		@params bettingObject
		Function uses @checkBettingObjectType and @createPABettingObject to create a standardized PA Betting Object and returns it to its caller
	*/
	standardizeJson : function( bettingObject ) {
		// TODO 03/04/2017: Wrap this function in a Promise.
		var objData = initializePABettingObject.checkBettingObjectType(bettingObject)

		var paObjectWithData = objData
		.then( function( object ) {
			// If change the call location of the createPABettingObject within the checkBettingObjectType function, I will be able to pipe the result
			// Object directly into the setValues function
			// var params = {
			// 	"bettingObject" : object.BettingObject,
			// 	"objectType" : object.ObjectType,
			// 	"paObject" : objData.paObject
			// }
			// console.log(object);
			
			// Call setValues with @paObject {Empty JSON Object}, @bettingObj {Object created from supplier XML}, @objType {Supplier Object Indentifier}
			return initializePABettingObject.setValues( object );
		})
		.catch( function( error ){
			// Need to promise otherwise the calling Promise block will not fail the test. The test will still be successful even if the data is Betting object
			// Structure is not recognised.
			console.log(error);
		})

		// Return standardized PA Betting Object
		return paObjectWithData;
	},

	/*
		@setValues function
		@params paObject, bettingObject, objectType
		Function determines which supplier the object is from using @objectType and returns standardizezed PA Betting object.
	*/
	setValues : function( params ) {
		// Error handling for the type of object is already executed in @checkBettingObjectType function.
		if ( params.ObjectType === "SA" ) {
			params.paObject.PABettingObject.Revision = params.BettingObject.HorseRacingX.Message["0"].$.seq;
			params.paObject.PABettingObject.MessageType = params.BettingObject.HorseRacingX.Message["0"].$.type;
			params.paObject.PABettingObject.Meeting.Course = params.BettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.country;
			params.paObject.PABettingObject.Meeting.Country = params.BettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.course;
			params.paObject.PABettingObject.Meeting.Date = params.BettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.date;
			// Default value. We need to figure out what meta data we can use to set this value to the different race status'.
			params.paObject.PABettingObject.Meeting.Status = "Dormant"; 
		}
		// Return PA Betting object to the @standardizeJson function
		return params.paObject
	},
}

module.exports = initializePABettingObject;