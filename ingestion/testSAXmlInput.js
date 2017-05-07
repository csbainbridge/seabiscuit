/*
	@@Imports
	Module is dependant @processXml
*/
var ingestionScripts = require('../ingestion');
var util = require('util');

// XML file to test
var fileName = 'sa20170503XED14500002.xml';

// Set processXml module as processXml and InitializePABettingObject module to initializePABettingObject
var processXml = ingestionScripts["processXml"];
var initializeBettingObject = ingestionScripts["initializeBettingObject"];
var setBettingValues = ingestionScripts["setBettingValues"]
var checkCountryCode = ingestionScripts["checkCountryCode"]
// if ingestion module does not exit log error to console.
if ( processXml == null || initializeBettingObject == null) {
	console.log("Fail: A function that is been used not exist.");
	return
}

/*
	Execute processXml passing fileName as parameter.
	If successful logs PA JSON Object to console.
	Logs unsuccessful parse errors to the console.
*/
	xml = processXml.readXML( fileName )
	processXml.parseXML(xml)
	.then( initializeBettingObject.init )
	.then( checkCountryCode )
	.then(function ( paBettingObject ) {
		console.log(util.inspect(paBettingObject, false, null));
	})
	.catch( function( error ) {
		console.log(
				"\n" + error.Error
				+ "\nAction: " + error.Action
			);
	});
