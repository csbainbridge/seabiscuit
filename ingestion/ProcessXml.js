/**
 * ProcessXml is used to read and parse xml files for a given directory
 */

/**
 * Dependencies
 * @fs, @xml2js, @bluebird
 */
var fs = require('fs');
var xml2js = require('xml2js');
var Promise = require('bluebird');

module.exports = {
  /**
   * Reads an xml file synchronously.
   * Async functionality meant that the betting files would be read out of order, possibility here would be to create two methods readXMLAsync and readXMLSync.
   * SA Betting files are sent with NULL bytes between each character. To resolve this a regular expression is used to match and replace all erroneous data.
   * 
   * @param {String} filePath
   * @return {String} Returns xml string
   */
  readXML : function( filePath ) {
    var xml = fs.readFileSync(filePath, "utf-8")
    var regEx = /[\x00]/g;
    validXml = xml.replace(regEx, "");
    return validXml
},
  /* 
    @parseXML function
    @params xml
    Parses xml string it was passed, and returns a Promise to its caller.
  */
  /**
   * Parses a xml string, and returns the JSON output as a string.
   * 
   * @param {String} xml The xml string to parse.
   * @return {Promise} Returns and resolved or rejected promise object.
   */
  parseXML : function( xml, filePath ) {
    var xmlParser = new xml2js.Parser({trim: true,});
    return new Promise(function( resolve, reject ) {
        xmlParser.parseString(xml, function( error, json ) {
          if ( error ) {
            reject({
              "Error" : error,
              "Action" : "Please check the XML (" + filePath + ")",
            });
            return
          }
          resolve(JSON.stringify(json));
      });
    })
  },
}