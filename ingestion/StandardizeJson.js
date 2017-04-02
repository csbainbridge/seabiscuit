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