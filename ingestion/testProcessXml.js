/*
	@@Imports
	Module is dependant @processXml
*/
var ingestionScripts = require('../ingestion');

// XML file to test
var fileName = "/sa20170317XFD12350002.xml";

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
	// console.log("Test Successful");
	console.log(paBettingObject);
})
.catch( function( error ) {
	console.log(error.message);
});






