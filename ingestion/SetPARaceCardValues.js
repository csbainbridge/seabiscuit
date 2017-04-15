/*
	@@SetPARaceCardValues module
	@desc - Standardization module
	Provides functions that are used to set the values of the {PA Race Card Object} using the {SA Betting Object}.
*/

/*
	@@Imports
	Module is dependant on @CreateIDs.
*/
var id = require('./CreateIDs');

// For testing
var util = require('util');
/*
	@setPARaceCardValues
	@param raceCardDataObject - Object containing {PA Race Card Object} and {SA Race Card Object}

	@desc - Sets all the values within the {PA Race Card Object} using the {SA Race Card Object} data that was sent from the supplier.
*/
function setPARaceCardValues( raceCardDataObject ) {
	var raceCardObject = raceCardDataObject.RaceCardObject.HorseRacingCard.Meeting["0"];
	var paRaceCardObject = raceCardDataObject.PAObject;
	var raceArray = getRaceArray(raceCardObject);
	var raceArrayToPush = createRaceObjToPush(raceArray);

	paRaceCardObject.PARaceCardObject.Meeting.Course = raceCardObject.$.course;
	paRaceCardObject.PARaceCardObject.Meeting.Country = raceCardObject.$.country;
	paRaceCardObject.PARaceCardObject.Meeting.Date = raceCardObject.$.date;
	paRaceCardObject.PARaceCardObject.Meeting.Status = raceCardObject.$.status;
	paRaceCardObject.PARaceCardObject.Meeting.Going = raceCardObject.AdvancedGoing["0"];
	paRaceCardObject.PARaceCardObject.Meeting.ID = id.createMeetingId(paRaceCardObject);
	pushToPARaceCardObject(paRaceCardObject, raceArrayToPush);

	// Return PA Race Card Object with standardized race card data.
	return paRaceCardObject;
}
/*
	@getRaceArray
	@param raceCardObject - SA Race Card Object

	@desc - Returns an array containing all of the races from the the SA Race Card Object.
*/
function getRaceArray( raceCardObject ) {
	var raceArray = [];
	raceCardObject.Race.map( function( race ) {
		raceArray.push(race)
	});
	return raceArray;
}
/*
	@pushToPARaceCardObject
	@param paRaceCardObject - PA Race Card Object
	@param raceArrayToPush - An array of standardized race objects

	@desc - Returns PA Race Card Object with its Race value set to an array of Races.
*/
function pushToPARaceCardObject( paRaceCardObject, raceArrayToPush) {
	raceArrayToPush.map(function( race ) {
		race.ID = id.createRaceId(paRaceCardObject, race.Time)
		paRaceCardObject.PARaceCardObject.Meeting.Race.push(race)
	})
	return paRaceCardObject
}
/*
	@createRaceObjToPush
	@param raceArray - SA Race Array

	@desc - Returns an array of standarized race objects.
*/
function createRaceObjToPush( raceArray ) {
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
		var standardizedHorseArray = createHorseObjToPush(race.Horse);
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
}
/*
	@createHorseObjToPush
	@param saHorseArray - SA Horse Array

	@desc - Returns an array of standardized horse objects.
*/
function createHorseObjToPush( saHorseArray ) {
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
		horseObject.Name = horse.$.name;
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

module.exports = {
	setPARaceCardValues : setPARaceCardValues,
}