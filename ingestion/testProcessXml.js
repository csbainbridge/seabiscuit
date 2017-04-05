/*
	@@Imports
	Module is dependant @processXml
*/
var ingestionScripts = require('../ingestion');
var util = require('util');

// XML file to test
var fileName = "/sa20170317XFD12350025.xml";

// Set processXml module as ingestScript
var processXml = ingestionScripts["processXml"];
var initializePABettingObject = ingestionScripts["initializePABettingObject"]
// if ingestion module does not exit log error to console.
if ( processXml == null || initializePABettingObject == null) {
	console.log("Fail: A function that is been used not exist.");
	return
}

/*
	Execute processXml passing fileName as parameter.
	If successful logs SA JSON Object to console.
	Logs unsuccessful parse errors to the console.
*/
// processXml.readXML( fileName )
// .then( processXml.parseXML )
// .then( standardizeJson.createPABettingObject )
// .then(function( json ) {
// 	console.log(json);
// })
// .catch( function( error ) {
// 	console.log("Unable to read file because: " + error.message);
// });

processXml.readXML( fileName )
.then( processXml.parseXML )
.then( initializePABettingObject.standardizeJson )
.then( function ( paBettingObject  ) {
	console.log(util.inspect(paBettingObject, false, null));
})
.catch( function( error ) {
	console.log("\nTest Unsuccessful" 
			+ "\n" + error.Error
			+ "\nAction: " + error.Action
		);
});






