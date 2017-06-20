/**
 * SetPARaceCardValues standardizes the SA JSON data to a PA JSON format.
 */

/**
 * Dependencies
 * @CreateIDs.
 */
var ingestionUtils = require('./IngestionUtils');

var setRaceCardValues = {
	/**
	 * Root function for setting values of the PARaceCardObject {Object}
	 * 
	 * @param {Object} raceCardObject An object containing the data to be processed.
	 * @returns {Object} Returns paRaceCardObject
	 */
	setPARaceCardValues : function( raceCardDataObject ) {
		var raceCardObject = raceCardDataObject.RaceCardObject.HorseRacingCard.Meeting["0"];
		var paRaceCardObject = raceCardDataObject.PAObject;
		var raceArray = setRaceCardValues.getRaceArray(raceCardObject);
		var raceArrayToPush = setRaceCardValues.createRaceObjToPush(raceArray);
		paRaceCardObject.PARaceCardObject.Meeting.Course = raceCardObject.$.course;
		paRaceCardObject.PARaceCardObject.Meeting.Country = raceCardObject.$.country;
		paRaceCardObject.PARaceCardObject.Meeting.Date = raceCardObject.$.date;
		paRaceCardObject.PARaceCardObject.Meeting.Status = raceCardObject.$.status;
		paRaceCardObject.PARaceCardObject.Meeting.Going = raceCardObject.AdvancedGoing["0"];
		paRaceCardObject.PARaceCardObject.Meeting.ID = ingestionUtils.createMeetingId(paRaceCardObject);
		setRaceCardValues.pushToPARaceCardObject(paRaceCardObject, raceArrayToPush);
		return paRaceCardObject;
	},
	/**
	 * Creates an array containing races using the raceCardObject.
	 * 
	 * @param {Object} raceCardObject The object with SA betting data.
	 * @returns {Array} Returns array of races.
	 */
	getRaceArray : function( raceCardObject ) {
		var raceArray = [];
		raceCardObject.Race.map( function( race ) {
			raceArray.push(race)
		});
		return raceArray;
	},
	/**
	 * Adds all races in the raceArrayToPush to the paraceCardObject.
	 * 
	 * @param {Object} paRaceCardObject The PA betting object
	 * @param {Array} raceArrayToPush The array of races
	 * @return {Object} Returns paRaceCardObject
	 */
	pushToPARaceCardObject : function( paRaceCardObject, raceArrayToPush ) {
		raceArrayToPush.map(function( race ) {
			race.ID = ingestionUtils.createRaceId(paRaceCardObject, race.Time)
			paRaceCardObject.PARaceCardObject.Meeting.Race.push(race)
		})
		return paRaceCardObject
	},
	/**
	 * Standardizes the data for each race in the raceArray, and adds these to the races array.
	 * 
	 * @param {Array} raceArray The array of races (SA Betting Data)
	 * @returns {Array} Returns an array of races (PA Betting Data)
	 */
	createRaceObjToPush : function( raceArray ) {
		var races = [];
		raceArray.map(function( race ) {
			var raceObject = {
				"ID" : "",
				"Time" : "",
				"Handicap" : "",
				"MaxRunners" : "",
				"RaceType" : "",
				"TrackType" : "",
				"Trifecta" : "",
				"Distance" : "",
				"Title" : "",
				"Horse" : "",
			}
			var standardizedHorseArray = setRaceCardValues.createHorseObjToPush(race.Horse);
			raceObject.Time = race.$.time;
			raceObject.Handicap = race.$.handicap;
			raceObject.MaxRunners = race.$.maxRunners;
			raceObject.RaceType = race.$.raceType;
			raceObject.TrackType = race.$.trackType;
			raceObject.Trifecta = race.$.trifecta;
			raceObject.Distance = race.Distance["0"].$.text;
			raceObject.Title = race.Title["0"];
			raceObject.Horse = standardizedHorseArray;
			races.push(raceObject);
		})
		return races;
	},
	/**
	 * Standardizes the data for each horse in the saHorseArray, and adds these to the horses array.
	 * 
	 * @param {Array} saHorseArray The array of horses (SA Betting Data)
	 * @returns {Array} Returns an array of horses (PA Betting Data)
	 */
	createHorseObjToPush : function( saHorseArray ) {
		var horses = [];
		saHorseArray.map(function( horse ) {
			var horseObject = {
			"Name" : "",
			"Bred" : "",
			"Cloth" : "",
			"Drawn" : "",
			"Weight" : {
				"Units" : "",
				"Value" : "",
			},
			"Jockey": {
				"Name" : "",
				"Allowance" : {
					"Units" : "",
					"Value" : "",
					},
				},
			}
			horseObject.Name = horse.$.name.toLowerCase();
			horseObject.Bred = horse.$.bred;
			horseObject.Cloth = horse.Cloth["0"].$.number;
			horseObject.Drawn = horse.Drawn["0"].$.stall;
			horseObject.Weight.Units = horse.Weight["0"].$.units;
			horseObject.Weight.Value = horse.Weight["0"].$.value;
			horseObject.Jockey.Name = horse.Jockey["0"].$.name;
			if (horse.Jockey["0"].Allowance) {
				horseObject.Jockey.Allowance.Units = horse.Jockey["0"].Allowance["0"].$.units;
				horseObject.Jockey.Allowance.Value = horse.Jockey["0"].Allowance["0"].$.value;
			}
			horses.push(horseObject)
		})
		return horses;
	}
}

module.exports = setRaceCardValues