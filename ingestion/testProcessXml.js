/*
	@@Imports
	Module is dependant @processXml
*/
var ingestionScripts = require('../ingestion');
var util = require('util');

// XML file to test
var fileName = "/sa20170317XGD19250018.xml";

// Set processXml module as processXml and InitializePABettingObject module to initializePABettingObject
var processXml = ingestionScripts["processXml"];
var initializePABettingObject = ingestionScripts["initializePABettingObject"]
// if ingestion module does not exit log error to console.
if ( processXml == null || initializePABettingObject == null) {
	console.log("Fail: A function that is been used not exist.");
	return
}

/*
	Execute processXml passing fileName as parameter.
	If successful logs PA JSON Object to console.
	Logs unsuccessful parse errors to the console.
*/
processXml.readXML( fileName )
.then( processXml.parseXML )
.then( initializePABettingObject.standardizeBettingData )
.then( function ( paBettingObject ) {
	console.log(util.inspect(paBettingObject, false, null));
})
.catch( function( error ) {
	console.log(
			"\n" + error.Error
			+ "\nAction: " + error.Action
		);
});
