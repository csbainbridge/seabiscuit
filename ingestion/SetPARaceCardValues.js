var util = require('util');
var id = require('./CreateIDs');

function setPARaceCardValues( raceCardDataObject ) {
	var raceCardObject = raceCardDataObject.RaceCardObject.HorseRacingCard.Meeting["0"];
	var paRaceCardObject = raceCardDataObject.PAObject;

	paRaceCardObject.PARaceCardObject.Meeting.Course = raceCardObject.$.course;
	paRaceCardObject.PARaceCardObject.Meeting.Country = raceCardObject.$.country;
	paRaceCardObject.PARaceCardObject.Meeting.Date = raceCardObject.$.date;
	paRaceCardObject.PARaceCardObject.Meeting.Status = raceCardObject.$.status;
	paRaceCardObject.PARaceCardObject.Meeting.Going = raceCardObject.AdvancedGoing["0"];
	paRaceCardObject.PARaceCardObject.Meeting.ID = id.createMeetingId(paRaceCardObject);

	var raceArray = getRaceArray(raceCardObject);
	var objToPush = createRaceObjToPush(raceArray);
	pushToPARaceCardObject(paRaceCardObject, objToPush);
	console.log(util.inspect(paRaceCardObject, false, null));

	return;
}

function getRaceArray( raceCardObject ) {
	var raceArray = [];
	raceCardObject.Race.map( function( race ) {
		raceArray.push(race)
	});
	return raceArray;
}

function pushToPARaceCardObject( paRaceCardObject, objToPush) {
	objToPush.map(function( race ) {
		race.ID = id.createRaceId(paRaceCardObject, race.Time)
		paRaceCardObject.PARaceCardObject.Meeting.Race.push(race)
	})
	return paRaceCardObject
}

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
			"Horse" : [],
		}

		raceObject.Time = race.$.time;
		raceObject.Handicap = race.$.handicap;
		raceObject.MaxRunners = race.$.maxRunners;
		raceObject.RaceType = race.$.raceType;
		raceObject.TrackType = race.$.trackType;
		raceObject.Trifecta = race.$.trifecta;
		raceObject.Distance = race.Distance["0"].$.text;
		raceObject.Title = race.Title["0"];
		races.push(raceObject);
	})
	return races;
}

// function createObjToPush( horseArray ) {
// 	var horseObject = {
// 		"Name" : "",
// 		"Bred" : "",
// 		"Cloth" : "",
// 		"Drawn" : "",
// 	}
// 	//HERE
// 	horseArray.map(function( horse ) {
// 		console.log(horse)
// 		horseObject.Name = horse.$.name;
// 		horseObject.Bred = horse.$.bred;
// 		horseObject.Cloth = horse.Cloth["0"].$.number;
// 		horseObject.Drawn = horse.Drawn["0"].$.stall;
		
// 		// return horseObject
// 	})
// }

// function getHorseArray( horseArray ) {

// 	var horseObjToPush = createObjToPush(horseArray);

// 	//Last step
// 	// console.log(horseObjToPush)
// 	return horseObjToPush;
// }

module.exports = {
	setPARaceCardValues : setPARaceCardValues,
}