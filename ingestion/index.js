/* 
	@@Imports
	Module is dependant on @processXML.
*/
var processXml = require('./ProcessXml.js');
var initializePABettingObject = require('./InitializePABettingObject.js');
var initializePARaceCardObject = require('./InitializePARaceCardObject.js');

// Export processXml as ProcessXml.
module.exports = {
	processXml : processXml,
	initializePABettingObject : initializePABettingObject,
	initializePARaceCardObject : initializePARaceCardObject,
}