/*
	@@Imports
	Module is dependant @processXml
*/
var ingestionScripts = require('../ingestion');

// XML file to test
var fileName = "/sa20170317XFD00000001.xml";

// Set processXml module as ingestScript
var processXml = ingestionScripts["processXml"];
var standardizeJson = ingestionScripts["standardizeJson"]
// if ingestion module does not exit log error to console.
if ( processXml == null || standardizeJson == null) {
	console.log("Fail: A function that is been used not exist.");
	return
}

/*
	Execute processXml passing fileName as parameter.
	If successful logs SA JSON Object to console.
	Logs unsuccessful parse errors to the console.
*/
processXml.readXML( fileName )
.then( processXml.parseXML )
.then( standardizeJson.createPABettingObject)
.then(function( json ) {
	console.log(json);
})
.catch( function( error ) {
	console.log("Unable to read file because: " + error.message);
});
