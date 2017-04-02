/*
	@@Imports
	Module is dependant @processXml
*/
var ingestionScripts = require('../ingestion');

// XML file to test
var fileName = "/sa20170317XFD00000001.xml";

// Set processXml module as ingestScript
var ingestScript = ingestionScripts["processXml"];

// if ingestion module does not exit log error to console.
if ( ingestScript == null ) {
	console.log("Fail: Function does not exist.");
	return
}

/*
	Execute processXml passing fileName as parameter.
	If successful logs SA JSON Object to console.
	Logs unsuccessful parse errors to the console.
*/
ingestScript
.readXML( fileName )
.then(ingestScript.parseXML)
.then( function( json )
{
	console.log(json);
})
.catch( function( error ) {
	console.log("Unable to read file because: " + error.message);
});