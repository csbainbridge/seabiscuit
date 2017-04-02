var fs = require('fs');
var xml2js = require('xml2js');
var xmlParser = new xml2js.Parser({
  trim: true,
});
var util = require('util');
var jsonfile = require('jsonfile');

// fs.readFile(__dirname + '/sa.xml', 'utf8', function( error, data ) {
//   xmlParser.parseString(data, function( error, result ) {
//     if ( error ) {
//       console.log(error);
//     }
//     var json = util.inspect(result, false, null);
//     fs.writeFile('json.json', json, 'utf8', function( error, data ) {
//     })
//   });
// });

// Object processXML provides functions @readXML, @parseXML and @writeToFile for parsing
// and converting an input file to a JSON object and saving to JSON file.
var processXML = {
  readXML : function( data, parse ) {
    var xml = fs.readFileSync(__dirname + data, 'utf8');
    var regEx = /[\x00]/g;
    xml = xml.replace(regEx, "");
    // instead of calling parseXML within this function, call it outside, this will make the code more reusable.
    fs.writeFileSync('xml1.xml', xml, 'utf8');
    if ( parse ) {
      processXML.parseXML(xml);
    } else {
      return xml;
    }
},
  parseXML : function( data ) {
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

module.exports = processXML


// Export to different module
// var standardizeData = {
//   saData : function( data ) {
//     fs.readFile(__dirname + data, 'utf8', function( error, data ) {
//       if ( error ) {
//         console.log(error);
//       } else {
//         // console.log(data);
//         // console.log(util.inspect(data, false, null));
//         var obj = {
//           "PABettingObject": {
//               revision: "",
//               messageType: "",
//           },
//         }
//         var parsedData = JSON.parse(data);
//         var revision = parsedData.HorseRacingX.Message["0"].$.seq;
//         var messageType = parsedData.HorseRacingX.Message["0"].$.type;
//         obj.PABettingObject.revision = revision;
//         obj.PABettingObject.messageType = messageType;
//         console.log(obj);
//       }
//     })
//   }
// }

processXML.readXML('/sa20170317XFD00000001.xml', true);
// standardizeData.saData('/json.json');
