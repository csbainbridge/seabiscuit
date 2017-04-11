var fs = require('fs');
var Promise = require('bluebird');


// For testing purposes
var util = require('util');

var initializePARaceCardObject = {

	createPARaceCardObject : function () {
		var raceCardObject = {
			"SeabiscuitPARaceCardSpecification" : "v0.111042017",
			"PARaceCardObject" : {
				"ObjectCreationTime" : new Date()
										.toISOString()
										.slice(0, 19)
										.replace(/[:-]/g, ''),
				"Meeting" : {
					"ID" : "",
					"Course" : "",
					"Country" : "",
					"Date" : "",
					"Status" : "",
					"Going" : "",
					"Race" : [],
				},
			},
		}
		return raceCardObject
	},
	standardizeRaceCardData : function( raceCardObject ) {
		return new Promise(function( resolve, reject ) {
			initializePARaceCardObject.createPARaceCardObject()
			.then(setPARaceCardValues(raceCardObject))
			.then(function( paObjectWithData ) {
				resolve(paObjectWithData);
			})
			.catch(function( error ){
				reject(error);
				return
			})
		});
	},
}

module.exports = initializePARaceCardObject;