/*
	@@Imports
	Module is dependant @processXml
*/
var ingestionScripts = require('../ingestion');

var fileName = "/sa20170317XFD12350002.xml";

var ingestScript = ingestionScripts["processXml"];
if ( ingestScript == null ) {
	console.log("Fail: Function does not exist.");
	return
}

ingestScript
.readXML( fileName )
.then( function( xml )
{
	return ingestScript.parseXML(xml);
})
.then( function( json )
{
	console.log(json);
})
.catch( function( error ) {
	console.log("Unable to read file because: " + error.message);
});