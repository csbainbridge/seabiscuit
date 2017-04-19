/*
  @@Module Nightswatch
  @desc - Watches a given directory for newly added files.
	@watchDirectories - Module Configuration Object
	@configformat - {"Watch" : "./path/to/directory"}
*/
var watchDirectories = [
	{"Watch" : "./zaf/betting"}, 
	{"Watch" : "./zaf/racecard"}
]

/*
	@Dependencies
	@fs, @underscore and @bluebird.
*/
var fs = require('fs');
var Promise = require('bluebird');
var _ = Promise.promisifyAll(require('underscore'));

/*
	@Globals
	@Array statArray - Stores file stat objects {Keys: FileName, AddedTime} {Values: name of current file being processed, file stat change time}.
	@Array liveDirectories - Stores directory objects {Keys: DirectoryName, NumOfFiles} {Values: name of directory, number of files in the given directory}.
*/
var statArray = [];
var liveDirectories = [];

/*
	@orderByTimeAdded function
	@param files - Array of files
	@param directory - Current directory being processed.
	@desc - Returns an array of file stat objects sorted by the time added to the given @directory.
*/
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

/*
	@createLiveDirectory
	@param directory - Directory object
	@desc - Creates a new live directory object and stores it in the @liveDirectories global array.
*/
function createLiveDirectory( directory ) {
	return new Promise(function( resolve, reject ){
		var newLiveDirectory = {
			"DirectoryName" : directory.DirectoryName,
			"NumOfFiles" : 0
		}
		resolve(liveDirectories.push(newLiveDirectory));
	})
}

function getFilesAdded( directoryData ) {
	return new Promise(function( resolve, result ) {
		_.each(liveDirectories, function( liveDirectory ) {
			_.each(directoryData, function( directory ) {
				if ( directory.DirectoryName === liveDirectory.DirectoryName && directory.Files.length > liveDirectory.NumOfFiles ) {
					var filesAdded = [];
					numOfFilesAdded = directory.Files.length - liveDirectory.NumOfFiles;
					fileArray = orderByTimeAdded(directory.Files, directory.DirectoryName);
					for (var i = numOfFilesAdded; i > 0; i--) {
						filesAdded.push((fileArray[i - 1]))
					}
					liveDirectory.NumOfFiles = directory.Files.length;
					resolve(_.sortBy(filesAdded, 'FileName'))
				}
			})
		})
	})
}

function checkDirectoryLength( directoryData ) {
	return new Promise(function( resolve, reject ) {
		if ( liveDirectories.length === 0 ) {
			directoryData.forEach(createLiveDirectory)
			.catch(function( error ) {
				return
			})
		} else if ( liveDirectories.length > 0 ) {
			getFilesAdded(directoryData)
			.then(function(files){
				resolve(files)
			})
			.catch(function(error){
				return
			})
		}
	})
}

/*
	@readDirectory
	@param directory - Current directory being processed.
	@desc - Returns an object containing the @directory and an array of files it contains.
	*/
function readDirectory( directory ) {
	return new Promise(function( resolve, reject ) {
		fs.readdir(directory, function( error, files ) {
			if ( error ) {
				reject(error)
				return
			}
			resolve({
				"DirectoryName" : directory,
				"Files" : files,
			})
		})
	})
}
/*
Testing Utils
*/
var testUtils = {
	logFileName : function( files ) {
		_.each(files, function( file ) {
			console.log(file.FileName)
		});
	}
}

/*
	@watcherOnTheWall function
	@desc - Module configuration. Specify a directory or multiple directory strings within the Promise.all() function.
*/
function watcherOnTheWall(watchDirectories) {
	return function() {
		var watchDirs = [];
		_.each(watchDirectories, function( directory ) {
			watchDirs.push(readDirectory(directory.Watch))
		})
		Promise.all(watchDirs)
		.then(checkDirectoryLength)
		.then(testUtils.logFileName)
		.catch(function(error) {
			return
		});
	}
}

setInterval(watcherOnTheWall(watchDirectories), 100);
