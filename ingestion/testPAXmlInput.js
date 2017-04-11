var ingestionScripts = require('../ingestion');
var util = require('util');

var fileName = "/c20170412gre.xml";

var processXml = ingestionScripts["processXml"]

// Create this function
var initializePARaceCardObject = ingestionScripts["initializePARaceCardObject"];

processXml.readXML(fileName)
.then(processXml.parseXML)
.then(initializePARaceCardObject.standardizeRaceCardData)
.then(function( paRaceCardObject ) {
	console.log(paRaceCardObject); 
})
.catch(function( error ) {
	console.log(
		"\n" + error.Error
		+ "\nAction: " + error.Action
	);	
});