/*
  @@Utils module
  Provides useful functions that perform operations on betting data when setting
  values within the {PA Betting Object}.
*/

var utils = {
  /* 
    @createTimeStamp function
    Returns an {ISO timestamp}
  */
	createTimeStamp : function() {
		return new Date().toISOString().slice(0, 19)
	},
  /*
    @createRaceID
    Returns a unique {Race ID}. Created using {SA Betting Object} metadata.
  */
	createRaceID : function() {
		return
	},
  /*
    @setRaceTimeValue
    Sets the {Time} value in the {PA Betting Object} using {SA Betting Object}.
  */
	setRaceTimeValue : function( paBettingObject, saBettingObject) {
		paBettingObject.PABettingObject.Meeting.Race.Time = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].$.time;
	},
  /*
    @setShows
    Iterates through each {SA Horse Object} in the {SA HorseRef Array}, creating a new {PA Horse Object} that is added to the {Horse Array}.
    When iterating over each {SA Horse Object}, the function iterates over the {SA Show Array} returning an {PA Show Array} for each object in the {Horse Array}.
    Returns {PA Betting Object}.
  */
	setShows : function( paBettingObject, saBettingObject ) {
		var runnerCount = 0;
    saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].HorseRef.map(function( horse ) {
      runnerCount += 1; 
      paBettingObject.PABettingObject.Meeting.Race.Horse.push({
        "Status" : "Runner",
        "Name" : horse.$.name,
        "Bred" : horse.$.bred,
        "Cloth" : horse.ClothRef["0"].$.number,
        "Show" : horse.Show.map(function( show ) {
            return {
              "TimeStamp" : show.$.timestamp,
              "Numerator" : show.$.numerator,
              "Denominator" : show.$.denominator,
              "Offer" : show.$.noOffers,
            };
        })
      });
    });
    paBettingObject.PABettingObject.Meeting.Race.Runners = runnerCount;
    utils.setRaceTimeValue(paBettingObject, saBettingObject);
    return paBettingObject;
	}
}

module.exports = utils