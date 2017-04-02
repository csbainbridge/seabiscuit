// @@Imports
// Module is dependant on @fs, @xml2js and @bluebird.
var fs = require('fs');
var xml2js = require('xml2js');
var Promise = require('bluebird');

// @@processXML object provides functions @readXML and @parseXML for production usage.
// Function @writeToFile is for testing usage only.
module.exports = {
  // @readXML function
  // @params fileName
  // Reads the contents of the file it was passed, removes NULL bytes from the file contents, and returns a Promise to its caller.
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

          // Uses regular expressesion to replace all NULL bytes from the file contents.
          validXml = fileContents.replace(regEx, "");
          resolve(validXml);
        });
    });
},
  parseXML : function( data ) {
    var xmlParser = new xml2js.Parser({trim: true,});
    xmlParser.parseString(data, function( error, data ) {
      if ( error ) {
        console.log(error);
      } else {
        processXML.writeToFile(data);
      }
    });
  },
  writeToFile : function( data ) {
    // var json = util.inspect(data, false, null);
    fs.writeFile('json.json', JSON.stringify(data), 'utf8', function( error, data ) {
      if ( error ) {
        console.log(error);
      } else {
        console.log('JSON File Created');
      }
    });
  }
}