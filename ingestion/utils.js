var utils = {
	createTimeStamp : function() {
		return new Date().toISOString().slice(0, 19)
	},
	createRaceID : function() {
		return
	},
	setRaceTimeValue : function( paBettingObject, saBettingObject) {
		paBettingObject.PABettingObject.Meeting.Race.Time = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].$.time;
	},
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