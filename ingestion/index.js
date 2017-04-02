/* 
	@@Imports
	Module is dependant on @processXML.
*/
var processXml = require('./ProcessXml.js');
var standardizeJson = require('./StandardizeJson');

// Export processXml as ProcessXml.
module.exports = {
	processXml : processXml,
	standardizeJson : standardizeJson,
}