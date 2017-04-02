var ingestionScripts = require('../ingestion');

var ingestScript = ingestionScripts["standardizeJson"];

if ( ingestScript == null ) {
	console.log("Fail: Function does not exist");
	return
}

ingestScript.createPABettingObject();
