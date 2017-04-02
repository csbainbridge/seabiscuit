var ingestionScripts = require('../ingestion');

var fileName = "/sa20170317XFD00000001.xml";

var ingestScript = ingestionScripts["processXml"];
console.log(ingestScript);
if ( ingestScript == null ) {
	console.log("Fail: Function does not exist.");
	return
}

ingestScript.readXML(fileName)
.then(function( xml ) {
	console.log(xml);
})
.catch(function( error ) {
	console.log(error);
})