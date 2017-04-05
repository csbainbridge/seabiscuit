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
				"ObjectCreationTime" : new Date(),
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
						"Horse" : [{
							"Status" : "",
							"Name" : "",
							"Bred" : "",
							"Cloth" : "",
							"Weight" : {
								"units" : "",
								"value" : "",
								"text" : "",
							},
							"Jockey" : {
								"Name" : "",
							},
							"Show" : [{
								"TimeStamp" : "",
								"Numerator" : "",
								"Denominator" : "",
							}],
							"Starting Price" : {
								"TimeStamp": "",
								"Numerator" : "",
								"Denominator" : "",
							},
							"Result" : {
								"FinishPos" : "",
								"Disqualified" : "",
								"BtnDistance" : "",
							}
						}],
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
		var parsedJson = JSON.parse(bettingObject);
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
		@standardizeJson function
		@params bettingObject
		Function uses @checkBettingObjectType and @createPABettingObject to create a standardized PA Betting Object and returns it to its caller
	*/
	standardizeJson : function( bettingObject ) {
		var objData = initializePABettingObject.checkBettingObjectType(bettingObject);

		var paObjectWithData = objData
		.then( function( object ) {
		
			var paObject = initializePABettingObject.createPABettingObject();
			var bettingDataObjects = {
				"BettingDataObject" : object.BettingObject,
				"ObjectType" : object.ObjectType,
				"PAObject" : paObject
			}
			
			// Call setValues with @paObject {Empty JSON Object}, @bettingObj {Object created from supplier XML}, @objType {Supplier Object Indentifier}
			return initializePABettingObject.setValues( bettingDataObjects );
		})
		.catch( function( error ){
			// Returns error to .catch of calling promise. Therefore no need to wrap this function in a promise.
			throw error;
		})

		// Return standardized PA Betting Object
		return paObjectWithData;
	},

	/*
		@setValues function
		@pas paObject, bettinramgObject, objectType
		Function determines which supplier the object is from using @objectType and returns standardizezed PA Betting object.
		TODO: When we start handling data coming from multiple suppliers it might be a good idea to create a separate module for this function to reduce the size of this file.
	*/
	setValues : function( bettingDataObjects ) {
		// Error handling for the type of object is already executed in @checkBettingObjectType function.
		if ( bettingDataObjects.ObjectType === "SA" ) {
			bettingDataObjects.PAObject.PABettingObject.Revision = bettingDataObjects.BettingDataObject.HorseRacingX.Message["0"].$.seq;
			bettingDataObjects.PAObject.PABettingObject.MessageType = bettingDataObjects.BettingDataObject.HorseRacingX.Message["0"].$.type;
			bettingDataObjects.PAObject.PABettingObject.Meeting.Course = bettingDataObjects.BettingDataObject.HorseRacingX.Message["0"].MeetRef["0"].$.country;
			bettingDataObjects.PAObject.PABettingObject.Meeting.Country = bettingDataObjects.BettingDataObject.HorseRacingX.Message["0"].MeetRef["0"].$.course;
			bettingDataObjects.PAObject.PABettingObject.Meeting.Date = bettingDataObjects.BettingDataObject.HorseRacingX.Message["0"].MeetRef["0"].$.date;
			// Default value. We need to figure out what meta data we can use to set this value to the different race status'.
			// Dom any ideas?
			bettingDataObjects.PAObject.PABettingObject.Meeting.Status = "Dormant"; 
		}
		// Return PA Betting object to the @standardizeJson function
		return bettingDataObjects.PAObject
	},
}

module.exports = initializePABettingObject;