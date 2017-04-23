/*
	@@Imports
	Module is dependant @processXml
*/
var ingestionScripts = require('../ingestion');
var util = require('util');

// XML file to test
var fileName = [
	"/zaf/betting/sa20170418XKD13150001.xml",
	"/zaf/betting/sa20170418XKD13150002.xml",
	"/zaf/betting/sa20170418XKD13150003.xml",
	"/zaf/betting/sa20170418XKD13150004.xml",
	"/zaf/betting/sa20170418XKD13150005.xml",
	"/zaf/betting/sa20170418XKD13150006.xml",
	"/zaf/betting/sa20170418XKD13150007.xml",
	"/zaf/betting/sa20170418XKD13150008.xml",
	"/zaf/betting/sa20170418XKD13150009.xml",
	"/zaf/betting/sa20170418XKD13150010.xml",
	"/zaf/betting/sa20170418XKD13150011.xml",
	"/zaf/betting/sa20170418XKD13150012.xml",
	"/zaf/betting/sa20170418XKD13150013.xml",
	"/zaf/betting/sa20170418XKD13150014.xml",
	"/zaf/betting/sa20170418XKD13150015.xml",
	"/zaf/betting/sa20170418XKD13150016.xml",
	"/zaf/betting/sa20170418XKD13150017.xml",
	"/zaf/betting/sa20170418XKD13150018.xml",
	"/zaf/betting/sa20170418XKD13150019.xml",
	"/zaf/betting/sa20170418XKD13150020.xml",
	"/zaf/betting/sa20170418XKD13150021.xml",
	"/zaf/betting/sa20170418XKD13150022.xml",
	"/zaf/betting/sa20170418XKD13150023.xml",
];

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
fileName.forEach(function(file){
	processXml.readXML( file )
	.then( processXml.parseXML )
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
})
