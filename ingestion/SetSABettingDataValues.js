/*
  @@SetSABettingDataValues
  Due to the South African data supplier sending fragmented data, the setValues function is used to set Message Type specific value
  in the paBettingObject
*/

/*
  @setValues function
  @params messageType
  Returns @setMessageTypeData function that is called with an empty PA Betting Object and SA Betting Object.
*/
function setMessageValues( messageType, paObject, saBettingObject ) {
    var paBettingObject = paObject;
    if ( messageType === "Weather" ) {
      paBettingObject.PABettingObject.Meeting.Race.Weather = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].Weather["0"].$.message;
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
