/*
  @@SetSABettingValues module
  Provides functions that are used to set the values of the {PA Betting Object} using the {SA Betting Object}.
*/

/*
  @@Imports
  Module is dependant on @Utils.
*/
var seabiscuitUtils = require('./SAUtils');
var util = require('util');
var id = require('./CreateIDs')
/*
    @setMessageValues
    SA data is fragmented, therefore this function uses the {Message Type} to set values within the {PA Betting Object} dynamically
    based on the {MessageType}.
  */
function setMessageValues( messageType, paObject, saBettingObject ) {
	var paBettingObject = paObject;
	switch(messageType) {
		case "Going":
			paBettingObject.PABettingObject.Meeting.Race.Going = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceGoing["0"].$.brief;
			break;

		case "Weather":
			paBettingObject.PABettingObject.Meeting.Race.Weather = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].Weather["0"].$.message;
			break;

		case "NonRunner":
			var NonRunnerObject = {
				"Status" : "",
				"Name" : "",
				"Bred" : "",
				"Cloth" : "",
			}
			var horseArray = seabiscuitUtils.getHorseArray(saBettingObject);
			var objToPush = seabiscuitUtils.createObjToPush(horseArray, NonRunnerObject, messageType);
			paBettingObject = seabiscuitUtils.pushToPABettingObject(paBettingObject, objToPush);
			seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject)
			break;

		case "Market":
			var showObject = {
				"Name" : "",
				"Bred" : "",
				"Cloth" : "",
				"Show" : {
					"TimeStamp" : "",
					"Numerator" : "",
					"Denominator" : "",
					"Offer" : "",
				}
			}
			var horseArray = seabiscuitUtils.getHorseArray(saBettingObject);
			var objToPush = seabiscuitUtils.createObjToPush(horseArray, showObject, messageType);
			seabiscuitUtils.pushToPABettingObject(paBettingObject, objToPush);
			seabiscuitUtils.countRaceRunners(paBettingObject);
			seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "Show":
			var showObject = {
				"Name" : "",
				"Bred" : "",
				"Cloth" : "",
				"Show" : {
					"TimeStamp" : "",
					"Numerator" : "",
					"Denominator" : "",
					"Offer" : "",
				}
			}
			var horseArray = seabiscuitUtils.getHorseArray(saBettingObject);
			var objToPush = seabiscuitUtils.createObjToPush(horseArray, showObject, messageType);
			seabiscuitUtils.pushToPABettingObject(paBettingObject, objToPush);
			seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "RaceState":
			paBettingObject.PABettingObject.Meeting.Race.Status = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceState["0"].$.status;
			paBettingObject.PABettingObject.Meeting.Race.StatusTimeStamp = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceState["0"].$.timestamp;
			seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "OffTime":
			paBettingObject.PABettingObject.Meeting.Race.OffTime = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].OffTime["0"].$.timestamp;
			seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "Result":
			var resultObject = {
				"Name" : "",
				"Bred" : "",
				"Cloth" : "",
				"StartingPrice" : {
					"Numerator" : "",
					"Denominator" : "",
				},
				"Result" : {
					"FinishPos" : "",
					"Disqualified" : "",
					"BtnDistance" : "",
				},
			}
			var horseArray = seabiscuitUtils.getHorseArray(saBettingObject);
			var objToPush = seabiscuitUtils.createObjToPush(horseArray, resultObject, messageType);
			paBettingObject = seabiscuitUtils.pushToPABettingObject(paBettingObject, objToPush);
			seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "WinningTime":
			paBettingObject.PABettingObject.Meeting.Race.WinningTime = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].WinningTime["0"].$.time;
			break;

		case "RaceDividends":
			saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceTote.map(function( tote ) {
				paBettingObject.PABettingObject.Meeting.Race.Returns.push(
						{
							"Type" : tote.$.type,
							"Currency" : tote.$.currency,
							"Dividend" : tote.$.dividend,
							"Horse" : tote.HorseRef.map(function( horse ) {
								return {
									"Name" : horse.$.name,
									"Bred" : horse.$.bred,
									"Cloth" : horse.ClothRef["0"].$.number
								}
							})
						}
					)
			})
			seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "JockeyChange":
			var jockeyChangeObject = {
		 	 		"Name" : "",
		 	 		"Bred" : "",
		 	 		"Cloth" : "",
		 	 		"JockeyChange" : {
		 	 			"Name" : "",
		 	 			"Units" : "",
		 	 			"Allowance" : "",
		 	 			"Overweight" : "",
		 	 	}
		 	}
			var horseArray = seabiscuitUtils.getHorseArray(saBettingObject);
			var objToPush = seabiscuitUtils.createObjToPush(horseArray, jockeyChangeObject, messageType);
			seabiscuitUtils.pushToPABettingObject(paBettingObject, objToPush);
			seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "Withdrawn":
			var withdrawnObject = {
				"Name" : "",
				"Bred" : "",
				"Cloth" : "",
				"WithdrawnPrice" : {
					"Numerator" : "",
					"Denominator" : "",
				}
			}
			var horseArray = seabiscuitUtils.getHorseArray(saBettingObject);
			var objToPush = seabiscuitUtils.createObjToPush(horseArray, withdrawnObject, messageType);
			seabiscuitUtils.pushToPABettingObject(paBettingObject, objToPush);
			seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;
		default:
			throw {"Error" : "Invalid Message Type: " + messageType,
					"Action" : "Check XML data to confirm if the Message Type sent is valid."};
	}
	return setDefaultValues(paBettingObject, saBettingObject);
}


/*
    @setDefaultValues
    Sets the default values in the {PA Betting Object} using values in the {SA Betting Object}.
  */
function setDefaultValues( paBettingObject, saBettingObject) {
	paBettingObject.PABettingObject.Revision = saBettingObject.HorseRacingX.Message["0"].$.seq;
	paBettingObject.PABettingObject.MessageType = saBettingObject.HorseRacingX.Message["0"].$.type;
	paBettingObject.PABettingObject.Meeting.Course = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.course;
	paBettingObject.PABettingObject.Meeting.Country = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.country;
	paBettingObject.PABettingObject.Meeting.Date = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.date;
	paBettingObject.PABettingObject.Meeting.Status = "Dormant"

	paBettingObject.PABettingObject.Meeting.ID = id.createMeetingId(paBettingObject);
	paBettingObject.PABettingObject.Meeting.Race.ID = id.createRaceId(paBettingObject);

	return paBettingObject;
}

module.exports = {
	setMessageValues : setMessageValues,
}