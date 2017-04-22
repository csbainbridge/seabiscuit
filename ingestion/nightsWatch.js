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
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var _ = Promise.promisifyAll(require('underscore'));

/*
	@Globals
	@Array statArray - Stores file stat objects {Keys: FileName, AddedTime} {Values: name of current file being processed, file stat change time}.
	@Array liveDirectories - Stores directory objects {Keys: DirectoryName, NumOfFiles} {Values: name of directory, number of files in the given directory}.
*/
var filesAdded = []
var statArray = [];
var liveDirectories = [];
var count = 0;

/*
	@param files - Array of files
	@param directory - Current directory being processed.
	@desc - Returns an array of file stat objects sorted by the time added to the given @directory.
*/
function orderByTimeAdded( files, directory ) {
	statArray = [];
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
	return liveDirectories.push({
		"DirectoryName" : directory.DirectoryName,
		"NumOfFiles" : 0
	});
}

function pushToArray( array ) {
	return function( item ) {
		array.push(item);
	}
}

function iterateFiles( numOfFilesAdded, fileArray, filesAdded ) {
	fileArray.slice(0, numOfFilesAdded).forEach(pushToArray(filesAdded))
}

function getFilesAdded( directoryData ) {
	return new Promise(function( resolve, reject ) {
		var dirMap = new Map()
		_.each(liveDirectories, function( liveDirectory) {
			dirMap.set(liveDirectory.DirectoryName, liveDirectory)
		})
		_.each(directoryData, function( directory ) {
			var liveDir = dirMap.get(directory.DirectoryName)
			if ( directory.Files.length > liveDir.NumOfFiles && count > 0) {
				var fileArray = [];
				filesAdded = [];
				numOfFilesAdded = directory.Files.length - liveDir.NumOfFiles
				fileArray = orderByTimeAdded(directory.Files, directory.DirectoryName);
				iterateFiles(numOfFilesAdded, fileArray, filesAdded)
				liveDir.NumOfFiles = directory.Files.length;
				count++
				resolve(_.sortBy(filesAdded, 'FileName'))
			} else {
				count++
			}
		})
	})
}

function checkDirectoryLength( directoryData ) {
	return new Promise(function( resolve, reject ) {
		if ( liveDirectories.length === 0 ) {
			directoryData.forEach(createLiveDirectory)
		} else if ( liveDirectories.length > 0 ) {
			resolve(getFilesAdded(directoryData))
		}
	})
}

/*
	@readDirectory
	@param directory - Current directory being processed.
	@desc - Returns an object containing the @directory and an array of files it contains.
	*/
function readDirectory( directory ) {
	return fs.readdirAsync(directory)
	.then(function( files ) {
		return { "DirectoryName" : directory, "Files" : files, }	
	}).catch(function( error ){
		return error
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

setInterval(watcherOnTheWall(watchDirectories), 1000);
