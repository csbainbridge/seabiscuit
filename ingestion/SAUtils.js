/**
 * Provides functions that perform operations on SA betting data when setting the values of the PA betting object.
 */

var saUtils = {
  /**
   * Sets the race race time.
   * 
   * @param {Object} paBettingObject The PA betting object.
   * @param {Object} saBettingObject The SA betting object.
   */
	setRaceTimeValue : function( paBettingObject, saBettingObject) {
    raceTime = this.standardizeRaceTime(saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].$.time);
		paBettingObject.PABettingObject.Meeting.Race.Time = raceTime;
	},
  /**
   * Modifies the race time sent in the SA betting data to match the race time shown on corresponding PA race cards.
   * 
   * @param {String} saTime The SA time string,
   * @return {String} Returns a standaridized race time string (UK time {0000+0100} Matches PA Race Card)
   */
  standardizeRaceTime : function( saTime ) {
    var prefix = saTime.slice(0, 1) + parseInt(saTime[1]) - 1
    prefix === -1 ? prefix = 12 : prefix
    return prefix + saTime.slice(2, 6) + parseInt(saTime[6] - 1 + saTime.slice(7, 9))
  },
  /**
   * Pushes each horse object to the paBettingObject.
   * 
   * @param {Object} paBettingObject The paBettingObject
   * @param {Array} array The array of horse objects
   * @return {Object} Returns the paBettingObject
   */
  pushToPABettingObject : function( paBettingObject, array ) {
    array.map(function( horse ) {
      paBettingObject.PABettingObject.Meeting.Race.Horse.push(horse)
    })
    return paBettingObject
  },
  /*
    @getHorseArray
    @param saBettingObject - SA Betting Data object sent from the supplier.

    @desc - Iterates over each horse in the {SA Betting Object}, and pushes it to the {Horse} array.
    Returns {Horse} array.
  */
  /**
   * Gets the sa horse objects from the saBettingObject
   * 
   * @param {Object} saBettingObject
   * @return {Array} Returns array of sa horse objects
   */
  getHorseArray : function( saBettingObject ) {
    var horseArray = [];
    saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].HorseRef.map(function( horse ){
      horseArray.push(horse)
    });
    return horseArray
  },
  /**
   * Creates an array of standardized horse objects based on the messageType.
   * 
   * @param {Array} horseArray
   * @param {String} messageType
   * @return {Object} Returns array of horse objects
   */
  createObjToPush : function( horseArray, messageType ) {
    var array = horseArray.map(function( horse ) {
      switch( messageType ) {
        case "JockeyChange":
          var jockeyChangeObject = {
            "Name" : "",
            "Bred" : "",
            "Cloth" : "",
            "Jockey" : {
              "Name" : "",
              "Allowance" : {
                "Units" : "",
                "Value" : ""
              },
              "Overweight" : {
                "Units" : "",
                "Value" : ""
              }
            }
		 	    }
          jockeyChangeObject.Jockey.Name = horse.JockeyChange["0"].$.name;
          jockeyChangeObject.Jockey.Allowance.Units = horse.JockeyChange["0"].$.units;
          jockeyChangeObject.Jockey.Allowance.Value = horse.JockeyChange["0"].$.allowance;
          jockeyChangeObject.Jockey.Overweight.Value = horse.JockeyChange["0"].$.overweight;
          jockeyChangeObject.Jockey.Overweight.Units = horse.JockeyChange["0"].$.units;
          saUtils.setHorseDetails(jockeyChangeObject, horse)
          return jockeyChangeObject
          break;
        case "NonRunner":
          var nonRunnerObject = {
            "Status" : "",
            "Name" : "",
            "Bred" : "",
            "Cloth" : "",
          }
          nonRunnerObject.Status = "NonRunner"
          saUtils.setHorseDetails(nonRunnerObject, horse)
          return nonRunnerObject
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
              "AmendedPos" : "",
              "BtnDistance" : "",
            },
          }
          horse.StartingPrice.map(function( startingPrice ) {
              resultObject.StartingPrice.Numerator = startingPrice.$.numerator
              resultObject.StartingPrice.Denominator = startingPrice.$.denominator
          })
          if (horse.Result) {
              horse.Result.map(function( result ) {
              resultObject.Result.FinishPos = result.$.finishPos;
              resultObject.Result.Disqualified = result.$.disqualified;
              resultObject.Result.BtnDistance = result.$.btnDistance;
              if ( result.$.amendedPos ) {
                resultObject.Result.AmendedPos = result.$.amendedPos;
              }
            })
          }
          saUtils.setHorseDetails(resultObject, horse)
          return resultObject
          break; 
        case "Market":
          var marketObject = {
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
          saUtils.setShow(marketObject, horse)
          saUtils.setHorseDetails(marketObject, horse)
          return marketObject
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
          saUtils.setShow(showObject, horse)
          saUtils.setHorseDetails(showObject, horse)
          return showObject
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
          horse.WithdrawnPrice.map(function( withdrawnPrice ) {
            withdrawnObject.WithdrawnPrice.Numerator = withdrawnPrice.$.numerator;
            withdrawnObject.WithdrawnPrice.Denominator = withdrawnPrice.$.denominator;
          })
          saUtils.setHorseDetails(withdrawnObject, horse)
          return withdrawnObject
        }
    })
    return array
  },
  /**
   * Gets the number of runners in a race.
   * 
   * @param {Object} paBettingObject The PA Betting Object
   * @return {Number} Returns the number of runners in a race
   */
  countRaceRunners : function( paBettingObject ) {
    var runnerCount = 0;
    paBettingObject.PABettingObject.Meeting.Race.Horse.map(function( horse ){
      runnerCount += 1;
    })
    return paBettingObject.PABettingObject.Meeting.Race.Runners = runnerCount;
  },
  /**
   * Sets the values of the Show/Market object.
   * 
   * @param {Object} object The Show/Market object
   * @param {Object} horse The SA horse object.
   * @return {Object} Returns the Show/Market object.
   */
  setShow : function( object, horse ) {
    return horse.Show.map(function( show ) {
       object.Show.TimeStamp = show.$.timestamp;
       object.Show.Numerator = show.$.numerator;
       object.Show.Denominator = show.$.denominator;
       object.Show.Offer = show.$.noOffers;
    })
  },
  /**
   * Sets the default values of the object.
   * 
   * @param {Object} object The object being processed
   * @param {Object} horse The SA horse object
   */
  setHorseDetails : function( object, horse ) {
    object.Name = horse.$.name;
    object.Bred = horse.$.bred;
    object.Cloth = horse.ClothRef["0"].$.number;
    return object
  }
}

module.exports = saUtils