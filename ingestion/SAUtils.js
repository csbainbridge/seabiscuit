/*
  @@SAUtils module
  Provides useful functions that perform operations on SA betting data when setting
  values within the {PA Betting Object}.
*/

var saUtils = {
  /*
    @setRaceTimeValue
    @param paBettingObject - PA Betting Object
    @param saBettingObject - SA Betting Object

    @desc - Sets the {Time} value in the {PA Betting Object} using {SA Betting Object}.
  */
	setRaceTimeValue : function( paBettingObject, saBettingObject) {
		paBettingObject.PABettingObject.Meeting.Race.Time = saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].$.time;
	},
  /*
    @pushToPABettingObject
    @param paBettingObject - PA Betting Object
    @param object - Standardized object to push to horse Array in the {PA Betting Object}

    @desc - Iterates over each horse in the {Object} array, and pushes it to the {Horse} array in the {PA Betting Object}.
  */ 
  pushToPABettingObject : function( paBettingObject, object ) {
    object.map(function( horse ) {
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
  getHorseArray : function( saBettingObject ) {
    var horseArray = [];
    saBettingObject.HorseRacingX.Message["0"].MeetRef["0"].RaceRef["0"].HorseRef.map(function( horse ){
      horseArray.push(horse)
    });
    return horseArray
  },
  /*
    @createObjToPush - Creates {Object} that is pushed to the {PA Betting Object} using the @pushToPABettingObject function.
    @param horseArray - Array of horses from the SA Betting Data object.
    @param object - PA Betting Object
    @param messageType - Message Type sent from the data supplier.

    @desc - Iterates over the {Horse} array, sets values within the {Object} depending on the {Message Type}.
    Returns {Object}
  */
  createObjToPush : function( horseArray, object, messageType ) {
    return horseArray.map(function( horse ) {
      switch( messageType ) {
        case "JockeyChange":
          object.JockeyChange.Name = horse.JockeyChange["0"].$.name;
          object.JockeyChange.Units = horse.JockeyChange["0"].$.units;
          object.JockeyChange.Allowance = horse.JockeyChange["0"].$.allowance;
          object.JockeyChange.Overweight = horse.JockeyChange["0"].$.overweight;
          break;
        case "NonRunner":
          object.Status = "NonRunner"
          break;
        case "Result":
          horse.StartingPrice.map(function( startingPrice ) {
              object.StartingPrice.Numerator = startingPrice.$.numerator
              object.StartingPrice.Denominator = startingPrice.$.denominator
          })
          if (horse.Result) {
              horse.Result.map(function( result ) {
              object.Result.FinishPos = result.$.finishPos;
              object.Result.Disqualified = result.$.disqualified;
              object.Result.BtnDistance = result.$.btnDistance;
            })
          }
          break; 
        case "Market":
          saUtils.setShow(object, horse);
          break;
        case "Show":
          saUtils.setShow(object, horse);
          break;
        case "Withdrawn":
          horse.WithdrawnPrice.map(function( withdrawnPrice ) {
            object.WithdrawnPrice.Numerator = withdrawnPrice.$.numerator;
            object.WithdrawnPrice.Denominator = withdrawnPrice.$.denominator;
          })
        }
      object.Name = horse.$.name;
      object.Bred = horse.$.bred;
      object.Cloth = horse.ClothRef["0"].$.number;
      return object
    })
  },
  /*
    @countRaceRunners
    @param paBettingObject - PA Betting Object

    @desc - Iterates over each horse in the {PA Betting Object} {Horse} array, and keeps a count.
    Returns {PA Betting Object} with "Runners" value set to the total horse count.
  */
  countRaceRunners : function( paBettingObject ) {
    var runnerCount = 0;
    paBettingObject.PABettingObject.Meeting.Race.Horse.map(function( horse ){
      runnerCount += 1;
    })
    return paBettingObject.PABettingObject.Meeting.Race.Runners = runnerCount;
  },
  /*
    @setShow
    @param object - PA Betting Object.
    @param horse - The current horse that is being iterated over.

    @desc - Iterates over each show in the {Horse} array, and creates a new array containing the Show data for each horse. 
  */
  setShow : function( object, horse ) {
    return horse.Show.map(function( show ) {
       object.Show.TimeStamp = show.$.timestamp;
       object.Show.Numerator = show.$.numerator;
       object.Show.Denominator = show.$.denominator;
       object.Show.Offer = show.$.noOffers;
    })
  },
  /*
    TODO: Export this function to a generalised utils module as this is not directly related to SA Betting data rather the PA Betting data.
    @createTimeStamp
    @desc - Creates an timestamp string following the format YYYYMMDDTHHMMSS (Example: 20170415T213645).
  */
  createTimeStamp : function() {
    return new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  },
}

module.exports = saUtils