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
  readXML : function( fileName ) {
    var filePath = __dirname + fileName;
    return new Promise(function( resolve, reject ) {
        fs.readFile(filePath, 'utf8', function( error, fileContents ) {
          if ( error ) {
            reject(error);
            return
          }
          // Creates Regular Expression for pattern matching all NULL bytes globally.
          var regEx = /[\x00]/g;

          // Uses regular expressesion to replace all NULL bytes in the the file contents.
          validXml = fileContents.replace(regEx, "");
          resolve(validXml);
        });
    });
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
            reject(error);
            return
          }
          resolve(JSON.stringify(json));
      });
    })
  },
}