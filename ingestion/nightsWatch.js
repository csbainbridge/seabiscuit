/*
  @@Module Nightswatch
  @desc - Watches a given directory for newly added files.
*/

var fs = require('fs');
var util = require('util');
var _ = require('underscore');
var Promise = require('bluebird');

var previousLength1 = 0;
var previousLength2 = 0;
var fileArray = [];
var statArray = [];

function orderByTimeAdded( files, directory ) {
  _.each(files, function getTimeAdded( file ) {
      var fileStats = fs.statSync(directory+"/"+file)
      statArray.push({
        "FileName" : file,
        "AddedTime" : fileStats.ctime
      });
  });
   return _.sortBy(statArray, 'AddedTime').reverse();
};

function logFile( file ) {
  console.log(file.FileName);
}

function readDirectory( directory ) {
    return new Promise(function( resolve, reject ) {
      fs.readdir(directory, function( error, files ) {
        if ( error ) {
          reject(error)
          return
        }
        resolve({
          "Directory" : directory,
          "Files" : files,
        })
      })
    })
}

function getFilesAdded( object ) {
  return new Promise(function( resolve, reject ) {
    _.each(object, function(directory) {
      if ( directory.Directory === './zaf/racecard' ) {
        if ( directory.Files.length > previousLength1 ) {
          var filesAdded = [];
          numOfFilesAdded = directory.Files.length - previousLength1;
          fileArray = orderByTimeAdded(directory.Files, directory.Directory);
          for (var i = numOfFilesAdded; i > 0; i--) {
            filesAdded.push((fileArray[i - 1]))
          }
          filesAddedSorted = _.sortBy(filesAdded, 'FileName');
          // console.log(filesAddedSorted);
          previousLength1 = directory.Files.length;
          resolve(filesAddedSorted)
        }
      } else if ( directory.Directory === './zaf/betting' ) {
          if ( directory.Files.length > previousLength2 ) {
            var filesAdded = [];
            numOfFilesAdded = directory.Files.length - previousLength2;
            fileArray = orderByTimeAdded(directory.Files, directory.Directory);
            for (var i = numOfFilesAdded; i > 0; i--) {
              filesAdded.push((fileArray[i - 1]))
            }
            filesAddedSorted = _.sortBy(filesAdded, 'FileName');
            previousLength2 = directory.Files.length;
            resolve(filesAddedSorted)
          }
      }
    })
  })
}

function watcherOnTheWall() {
  return function() {
    Promise.all([
      readDirectory('./zaf/betting'),
      readDirectory('./zaf/racecard'),
    ]).then(getFilesAdded)
      .then(function(result) {
        _.forEach(result, function(file) {
          console.log(file.FileName)
        })
    }).catch(function(error) {
      return
    });
  }
}

function nightsWatch() {
  setInterval(watcherOnTheWall(), 100);
}

nightsWatch();
