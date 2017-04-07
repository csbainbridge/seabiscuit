var seabiscuitUtils = require('./utils');

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
			seabiscuitUtils.setRaceTimeValue(paBetttingObject, saBettingObject);
			break;
		case "Market":
			paBettingObject = seabiscuitUtils.setShows(paBettingObject, saBettingObject);
			break;
		case "Show":
			paBettingObject = seabiscuitUtils.setShows(paBettingObject, saBettingObject);
			break;
	}
}

function setDefaultValues( paObject, saBettingObject) {
	paObject.PABettingObject.Revision = saBettingObject.HorseRacingX.Message["0"].$.seq;
	paObject.PABettingObject.MessageType = saBettingObject.HorseRacingX.Message["0"].$.type;
	paObject.PABettingObject.Meeting.Course = saBettingObject.HorseRacingX.Message["0"].$.course;
}

module.exports = {
	setMessageValues : setMessageValues,
	setDefaultValues : setDefaultValues
}