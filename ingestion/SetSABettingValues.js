/*
  @@SetSABettingValues module
  Provides functions that are used to set the values of the {PA Betting Object} using the {SA Betting Object}.
*/

/*
  @@Imports
  Module is dependant on @Utils.
*/
var seabiscuitUtils = require('./Utils');

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
			saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].HorseRef.map(function(horse) {
				paBettingObject.paBettingObject.Meeting.Race.Horse.push(
					{
						"Status" : "NonRunner",
						"Name" : horse.$.name,
						"Bred" : horse.$.bred,
						"Cloth" : horse.ClothRef["0"].$.number,
					}
				)
			});
			// Test this function, may need to return the object from the function
			seabiscuitUtils.setRaceTimeValue(paBetttingObject, saBettingObject);
			break;
		case "Market":
			paBettingObject = seabiscuitUtils.setShows(paBettingObject, saBettingObject);
			break;
		case "Show":
			paBettingObject = seabiscuitUtils.setShows(paBettingObject, saBettingObject);
			break;
	}
	return paBettingObject
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
	return paBettingObject;
}

module.exports = {
	setMessageValues : setMessageValues,
	setDefaultValues : setDefaultValues
}