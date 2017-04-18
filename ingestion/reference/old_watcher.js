/*
  @@Module Nightswatch
  @desc - Watches a given directory for newly added files.
*/

var fs = require('fs');
var util = require('util');
var _ = require('underscore');
var Promise = require('bluebird');

var previousLength = 0;
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
    if ( object.Files.length > previousLength ) {
      var newFiles = [];
      numOfFilesAdded = object.Files.length - previousLength;
      fileArray = orderByTimeAdded(object.Files, object.Directory);
      for (var i = numOfFilesAdded; i > 0; i--) {
        newFiles.push(fileArray[i - 1])
      }
      filesAdded = _.sortBy(newFiles, 'FileName');
      // console.log(filesAdded);
      previousLength = object.Files.length;
      resolve(filesAdded);
    } else {
      reject()
      return
    }
  })
}

function watcherOnTheWall( directory ) {
      return function() {
        readDirectory(directory)
        .then(getFilesAdded)
        .then(function( addedFiles ) {
          addedFiles.map(function( file ) {
            console.log(file.FileName);
          })
        })
        .catch(function( error ) {
            return
        })
      }

}

function nightsWatch() {
 setInterval(watcherOnTheWall("./files"), 100);
}

nightsWatch();
