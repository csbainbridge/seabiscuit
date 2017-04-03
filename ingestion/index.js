/* 
	@@Imports
	Module is dependant on @processXML.
*/
var processXml = require('./ProcessXml.js');
var initializePABettingObject = require('./InitializePABettingObject');

// Export processXml as ProcessXml.
module.exports = {
	processXml : processXml,
	initializePABettingObject : initializePABettingObject,
}