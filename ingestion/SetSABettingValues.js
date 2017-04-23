/*
  @@SetSABettingValues module
  @desc - Standarization module
  Provides functions that are used to set the values of the {PA Betting Object} using the {SA Betting Object}.
*/

/*
  @@Imports
  Module is dependant on @SAUtils and @CreateIDs.
*/
var saUtils = require('./SAUtils');
var ingestionUtils = require('./IngestionUtils')

// For testing.
var util = require('util');
/*
    @setMessageValues
    @param messageType - Message Type sent from the data supplier.
    @param paObject - PA Betting Object.
    @param saBettingObject - SA Betting Object.

    @desc - SA data is fragmented, therefore this function uses the {Message Type} to set values within the {PA Betting Object} dynamically
    based on the {MessageType}.
  */
function checkMessageValues( messageType, paObject, saBettingObject ) {
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
			var horseArray = saUtils.getHorseArray(saBettingObject);
			var objToPush = saUtils.createObjToPush(horseArray, NonRunnerObject, messageType);
			paBettingObject = saUtils.pushToPABettingObject(paBettingObject, objToPush);
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject)
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
			var horseArray = saUtils.getHorseArray(saBettingObject);
			var objToPush = saUtils.createObjToPush(horseArray, showObject, messageType);
			saUtils.pushToPABettingObject(paBettingObject, objToPush);
			saUtils.countRaceRunners(paBettingObject);
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
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
			var horseArray = saUtils.getHorseArray(saBettingObject);
			var objToPush = saUtils.createObjToPush(horseArray, showObject, messageType);
			saUtils.pushToPABettingObject(paBettingObject, objToPush);
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "RaceState":
			paBettingObject.PABettingObject.Meeting.Race.Status = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceState["0"].$.status;
			paBettingObject.PABettingObject.Meeting.Race.StatusTimeStamp = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceState["0"].$.timestamp;
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "OffTime":
			paBettingObject.PABettingObject.Meeting.Race.OffTime = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].OffTime["0"].$.timestamp;
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
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
			var horseArray = saUtils.getHorseArray(saBettingObject);
			var objToPush = saUtils.createObjToPush(horseArray, resultObject, messageType);
			paBettingObject = saUtils.pushToPABettingObject(paBettingObject, objToPush);
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;

		case "WinningTime":
			paBettingObject.PABettingObject.Meeting.Race.WinningTime = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].WinningTime["0"].$.time;
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
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
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
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
			var horseArray = saUtils.getHorseArray(saBettingObject);
			var objToPush = saUtils.createObjToPush(horseArray, jockeyChangeObject, messageType);
			saUtils.pushToPABettingObject(paBettingObject, objToPush);
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
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
			var horseArray = saUtils.getHorseArray(saBettingObject);
			var objToPush = saUtils.createObjToPush(horseArray, withdrawnObject, messageType);
			saUtils.pushToPABettingObject(paBettingObject, objToPush);
			saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
			break;
		default:
			throw {"Error" : "Invalid Message Type: " + messageType,
					"Action" : "Check XML data to confirm if the Message Type sent is valid."};
	}
	return setDefaultValues(paBettingObject, saBettingObject);
}


/*
    @setDefaultValues
    @param paBettingObject - PA Betting Object
    @param saBettingObject - SA Betting Object
    
    @desc - Sets the default values in the {PA Betting Object} using values in the {SA Betting Object}.
  */
function setDefaultValues( paBettingObject, saBettingObject) {
	paBettingObject.PABettingObject.Revision = saBettingObject.HorseRacingX.Message["0"].$.seq;
	paBettingObject.PABettingObject.MessageType = saBettingObject.HorseRacingX.Message["0"].$.type;
	paBettingObject.PABettingObject.Meeting.Course = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.course;
	paBettingObject.PABettingObject.Meeting.Country = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.country;
	paBettingObject.PABettingObject.Meeting.Date = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.date;
	paBettingObject.PABettingObject.Meeting.Status = "Dormant"
	paBettingObject.PABettingObject.Meeting.ID = ingestionUtils.createMeetingId(paBettingObject);
	paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
	// Return PA Betting Object with standardized betting data.
	return paBettingObject;
}

module.exports = {
	checkMessageValues : checkMessageValues,
}