/**
 * Index is used to collect and export multiple modules within the ingestion directory.
 * 
 * Exports
 * @ProcessXml, @InitializePABettingObject, @InitializePARaceCardObject, @SetPARaceCardValues
 */
var processXml = require('./ProcessXml.js'),
	initializeBettingObject = require('./InitializePABettingObject.js'),
	initializeRaceCardObject = require('./InitializePARaceCardObject.js'),
	setRaceCardValues = require('./SetPARaceCardValues.js'),
	checkCountryCode = require('./CheckCountryCode.js'),
	nightsWatch = require('./nightsWatch')

module.exports = {
	processXml : processXml,
	initializeBettingObject : initializeBettingObject,
	initializeRaceCardObject : initializeRaceCardObject,
	setRaceCardValues : setRaceCardValues,
	checkCountryCode : checkCountryCode.checkCountryCode,
	nightsWatch : nightsWatch,
}