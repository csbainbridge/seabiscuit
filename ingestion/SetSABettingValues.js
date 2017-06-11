/**
 * SetSABettingValues standardizes the SA JSON data to a PA JSON format.
 */

/**
 * Dependencies
 * @SAUtils, @IngestionUtils
 */
var saUtils = require('./SAUtils'),
	ingestionUtils = require('./IngestionUtils')

var setBettingValues = {
	/**
	 * Sets the values of the PA betting object based on the message type of the data sent from the supplier.
	 * 
	 * @param {String} messageType The message type to be checked.
	 * @param {Object} paObject The PA betting object.
	 * @param {Object} saBettingObject The object with SA betting data
	 * @return {Object} Returns paBettingObject
	 */
	setBettingValues : function( messageType, paObject, saBettingObject ) {
		var paBettingObject = paObject
		paBettingObject.PABettingObject.Revision = saBettingObject.HorseRacingX.Message["0"].$.seq;
		paBettingObject.PABettingObject.MessageType = saBettingObject.HorseRacingX.Message["0"].$.type;
		paBettingObject.PABettingObject.Meeting.Course = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.course;
		paBettingObject.PABettingObject.Meeting.Country = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.country;
		paBettingObject.PABettingObject.Meeting.Date = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.date;
		paBettingObject.PABettingObject.Meeting.Status = "Dormant"
		paBettingObject.PABettingObject.Meeting.ID = ingestionUtils.createMeetingId(paBettingObject);
		switch(messageType) {
			case "Going":
				paBettingObject.PABettingObject.Meeting.Going = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceGoing["0"].$.brief;
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject)
				break;
			case "Weather":
				paBettingObject.PABettingObject.Meeting.Weather = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].Weather["0"].$.message;
				break;
			case "NonRunner":
				setBettingValues.initHorseObjects(saBettingObject, messageType, paBettingObject)
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject)
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			case "Market":
				setBettingValues.initHorseObjects(saBettingObject, messageType, paBettingObject)
				saUtils.countRaceRunners(paBettingObject);
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			case "Show":
				setBettingValues.initHorseObjects(saBettingObject, messageType, paBettingObject)
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			case "RaceState":
				paBettingObject.PABettingObject.Meeting.Race.Status = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceState["0"].$.status;
				paBettingObject.PABettingObject.Meeting.Race.StatusTimeStamp = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceState["0"].$.timestamp;
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			case "OffTime":
				paBettingObject.PABettingObject.Meeting.Race.OffTime = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].OffTime["0"].$.timestamp;
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			case "Result":
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject)
				if ( !saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].HorseRef ) {
					console.log("ALERT: " + paBettingObject.PABettingObject.Meeting.Race.ID + " (Revision: " + paBettingObject.PABettingObject.Revision + ") " + messageType + " file contains no result data " + new Date())
				} else {
					setBettingValues.initHorseObjects(saBettingObject, messageType, paBettingObject);
				}
				break;
			case "WinningTime":
				paBettingObject.PABettingObject.Meeting.Race.WinningTime = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].WinningTime["0"].$.time;
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
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
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			case "JockeyChange":
				setBettingValues.initHorseObjects(saBettingObject, messageType, paBettingObject)
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			case "Withdrawn": 
				setBettingValues.initHorseObjects(saBettingObject, messageType, paBettingObject)
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			case "Stewards":
				paBettingObject.PABettingObject.Meeting.Race.Stewards = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].Stewards["0"].$.objection;
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			case "Objection":
				paBettingObject.PABettingObject.Meeting.Race.Objection = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].Stewards["0"].$.objection;
				saUtils.setRaceTimeValue(paBettingObject, saBettingObject);
				paBettingObject.PABettingObject.Meeting.Race.ID = ingestionUtils.createRaceId(paBettingObject);
				break;
			default:
				throw { "Error" : "Invalid Message Type: " + messageType,
						"Action" : "Check XML data to confirm if the Message Type sent is valid." };
		}
		return paBettingObject;
	},
	/**
	 * Initializes and added an array of horse objects to the PA betting object.
	 * 
	 * @param {Object} saBettingObject The object with SA betting data
	 * @param {String} messageType The message type to be checked
	 * @param {Object} paBettingObject The PA betting object
	 */
	initHorseObjects: function( saBettingObject, messageType, paBettingObject ) {
		var horseArray = saUtils.getHorseArray(saBettingObject);
		var objToPush = saUtils.createObjToPush(horseArray, messageType);
		paBettingObject = saUtils.pushToPABettingObject(paBettingObject, objToPush);
		return;
	}
}

module.exports = setBettingValues