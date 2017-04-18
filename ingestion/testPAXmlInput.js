var ingestionScripts = require('../ingestion');
var setPARaceCardValues = require('./SetPARaceCardValues.js');
var util = require('util');

var fileName = "/c20170416scv.xml";

var processXml = ingestionScripts["processXml"]

// Create this function
var initializePARaceCardObject = ingestionScripts["initializePARaceCardObject"];

processXml.readXML(fileName)
.then(processXml.parseXML)
.then(initializePARaceCardObject.standardizeRaceCardData)
.then(setPARaceCardValues)
.then(function( paRaceCardObject ) {
	console.log(util.inspect(paRaceCardObject, false, null));
})
.catch(function( error ) {
	console.log(
		"\n" + error.Error
		+ "\nAction: " + error.Action
	);
});
