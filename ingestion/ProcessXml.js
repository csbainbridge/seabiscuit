/*
  @@Imports
  Module is dependant on @fs, @xml2js and @bluebird.
*/
var fs = require('fs');
var xml2js = require('xml2js');
var Promise = require('bluebird');

/*
  @@processXml object provides functions @readXML and @parseXML for production usage.
*/
module.exports = {
  /* 
    @readXML function
    @params fileName
    Reads the contents of the file it was passed, removes NULL bytes from the file contents, and returns a Promise to its caller.
  */
  // Async functionality meant that the betting files would be read out of order, possibility here would be to create two methods readXMLAsync and readXMLSync
  readXML : function( filePath ) {
    // console.log(filePath)
    // return new Promise(function( resolve, reject ) {
    var xml = fs.readFileSync(filePath, "utf-8")
    // Creates Regular Expression for pattern matching all NULL bytes globally.
    var regEx = /[\x00]/g;

      //   // Uses regular expressesion to replace all NULL bytes in the the file contents.
    validXml = xml.replace(regEx, "");
    return validXml
},
  /* 
    @parseXML function
    @params xml
    Parses xml string it was passed, and returns a Promise to its caller.
  */
  parseXML : function( xml ) {
    var xmlParser = new xml2js.Parser({trim: true,});
    return new Promise(function( resolve, reject ) {
        xmlParser.parseString(xml, function( error, json ) {
          if ( error ) {
            reject({
              "Error" : error,
              "Action" : "Please check the XML from the data supplier.",
            });
            return
          }
          resolve(JSON.stringify(json));
      });
    })
  },
}