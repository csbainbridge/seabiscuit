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
			// Might be possible to create a function that returns the result of map as this line seems to be used multiple times in this block of code.
			saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].HorseRef.map(function( horse ) {
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
			// Might be possible to create a function that returns the result of map as this line seems to be used multiple times in this block of code.
			// In the XML revision 17 and 19 the result is sent twice need to clarify this with Isaac/Dom
			saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].HorseRef.map(function( horse ) {
				paBettingObject.PABettingObject.Meeting.Race.Horse.push(
					{
						"Name" : horse.$.name,
						"Bred" : horse.$.bred,
						"Cloth" : horse.ClothRef["0"].$.number,
						"StartingPrice" : horse.StartingPrice.map(function( startingPrice ) {
							return {
								"Numerator" : startingPrice.$.numerator,
								"Denominator" : startingPrice.$.denominator, 
                			};
						}),
						"Result" : horse.Result.map(function( result ) {
							return {
								"FinishPos" : result.$.finishPos,
								"Disqualified" : result.$.disqualified,
								"BtnDistance" : result.$.btnDistance,
							}
						})
					}
				);
			});
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
			//Code
			break;
		case "Withdrawn":
			//Code
			break;
		// Are there any other race status'?
	}
	return setDefaultValues(paBettingObject, saBettingObject);
}


/*
    @setDefaultValues
    Sets the default values in the {PA Betting Object} using values in the {SA Betting Object}.
    TODO: Need to write a function that uses metadata to set the race status as going down
    TODO: Need to write a function that checks the meeting status (Clarify with Isaac if the supplier sends a message that details the state of the meeting)
  */
function setDefaultValues( paBettingObject, saBettingObject) {
	paBettingObject.PABettingObject.Revision = saBettingObject.HorseRacingX.Message["0"].$.seq;
	paBettingObject.PABettingObject.MessageType = saBettingObject.HorseRacingX.Message["0"].$.type;
	paBettingObject.PABettingObject.Meeting.Course = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.course;
	paBettingObject.PABettingObject.Meeting.Country = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.country;
	paBettingObject.PABettingObject.Meeting.Date = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.date;
	paBettingObject.PABettingObject.Meeting.Status = "Dormant"
	return paBettingObject;
}

module.exports = {
	setMessageValues : setMessageValues,
}