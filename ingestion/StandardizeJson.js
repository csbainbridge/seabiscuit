/*
	@@Imports
	Module is dependant on @fs.
*/
var fs = require('fs');
var Promise = require ('bluebird');

/*
	@@standardizeJson object provides function @createPABettingObject.
*/
module.exports = {
	/*
	@createPABettingObject function
	@params json
	Creates PABettingObject, and sets its values using the json data is was passed.
	*/
	createPABettingObject : function( json ) {
		
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

		var parsedJson = JSON.parse(json);

		// Set the values of the PABettingObject using SA Betting Object
		// We will need to add conditional logic to determine the type of Betting Object the function has been passed.
		// For example, this function might be passed Australian Betting at a later date, it would'nt make sense to re-write the entire function.
		obj.PABettingObject.Revision = parsedJson.HorseRacingX.Message["0"].$.seq;
		obj.PABettingObject.MessageType = parsedJson.HorseRacingX.Message["0"].$.type;
		obj.PABettingObject.Meeting.Course = parsedJson.HorseRacingX.Message["0"].MeetRef["0"].$.country;
		obj.PABettingObject.Meeting.Country = parsedJson.HorseRacingX.Message["0"].MeetRef["0"].$.course;
		obj.PABettingObject.Meeting.Date = parsedJson.HorseRacingX.Message["0"].MeetRef["0"].$.date;
		// Default value. We need to figure out what meta data we can use to set this value to the different race status'.
		obj.PABettingObject.Meeting.Status = "Dormant"; 

		return obj;

	}
}