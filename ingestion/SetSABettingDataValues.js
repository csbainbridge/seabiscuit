/*
  @@SetSABettingDataValues
  Due to the South African data supplier sending fragmented data, the setValues function is used to set Message Type specific value
  in the paBettingObject
*/

/*
  @@Imports
  Module is dependant on @utils.
*/

var seabiscuitUtils = require('./utils');

/*
  @setMessageValues function
  @params messageType, paObject, saBettingObject
  Returns paBettingObject.
*/
function setMessageValues( messageType, paObject, saBettingObject ) {
    
    var paBettingObject = paObject;
    
    switch( messageType ) {
      case "Going":
        paBettingObject.PABettingObject.Meeting.Race.Going = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].RaceGoing["0"].$.brief;
        seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
        break;

      case "Weather":
        paBettingObject.PABettingObject.Meeting.Race.Weather = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].Weather["0"].$.message;
        break;

      case "NonRunner":
        saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].HorseRef.map(function( horse ) {
          paBettingObject.PABettingObject.Meeting.Race.Horse.push({
            "Status" : "NonRunner",
            "Name" : horse.$.name,
            "Bred" : horse.$.bred,
            "Cloth" : horse.ClothRef["0"].$.number,
          })
        });
        seabiscuitUtils.setRaceTimeValue(paBettingObject, saBettingObject);
        break

      case "Market":
        paBettingObject = seabiscuitUtils.setShows(paBettingObject, saBettingObject);
        break;

      case "Show":
        paBettingObject = seabiscuitUtils.setShows(paBettingObject, saBettingObject);
        break;

      case "RaceState":
        //
        break;
      case "OffTime":
        //
        break;
      case "Result":
        //
        break;
      case "WinningTime":
        //
        break;
      case "RaceDividends":
        //
        break;
      case "JockeyChange":
        //
        break;
      case "Withdrawn":
        //
        break;
      default:
      return paBettingObject;
    }
}

/*
  TODO: Complete function
*/
function setDefaultValues( paObject, bettingObject ) {
  // Move this code to the SetSABettingDataValues module
  paObject.PABettingObject.Revision = bettingObject.HorseRacingX.Message["0"].$.seq;
  paObject.PABettingObject.MessageType = bettingObject.HorseRacingX.Message["0"].$.type;
  paObject.PABettingObject.Meeting.Course = bettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.course;
  paObject.PABettingObject.Meeting.Country = bettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.country;
  paObject.PABettingObject.Meeting.Date = bettingObject.HorseRacingX.Message["0"].MeetRef["0"].$.date;
  // They do not send Race Status in the XML. Create a function that uses meta data to set the race status
  paObject.PABettingObject.Meeting.Status = "Dormant";
  paObject.PABettingObject.Meeting.Race.Status = "Dormant";
}

module.exports = {
	setMessageValues : setMessageValues,
  setDefaultValues : setDefaultValues
}
