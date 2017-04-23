/*
* NightsWatch watches a given or multiple directories for the addition of files.
*/

/*
* Dependencies
* @bluebird, @fs, @underscore
*/

//temp
var ingestionScripts = require('../ingestion'),
    util = require('util')


var Promise = require('bluebird'), 
    fs = Promise.promisifyAll(require('fs')),
    _ = Promise.promisifyAll(require('underscore'))

var nightsWatch = (function() {
    var statArray = []
    var liveDirectories = []
    var prevFileCount = 0;
    /**
    * Calls watcherOnTheWall function with @WatchDirs for the time specified in @IntervalTime.
    */
    function Watch() {
        try {
            if(typeof watcher.onAdd!=='function'){throw "Error: " + typeof watcher.onAdd + " is not a function"}else if(watcher.onAdd.length !== 1){throw "Error: onAdd takes a single param of {Array} type"}
            setInterval(watcherOnTheWall(watcher.WatchDirs), watcher.IntervalTime)
        }catch(e) {
            console.log(e)
        }
    }

    /**
     * Returns the function set during {Object} initialization.
     * 
     * @param {Function} definedFunction function called when files are added 
     */
    function onAdd( definedFunction ) {
        return definedFunction
    }

    /**
     * Root function that uses @directories to process files that exist and are added to a given directory.
     * 
     * @param {Array} directories The array to iterate over.
     */
    function watcherOnTheWall( directories, definedFunction ) {
        return function() {
            var dirsToWatch = []
            _.each(directories, function(directory) {
                dirsToWatch.push(watcher.readDirectory(directory))
            })
            Promise.all(dirsToWatch)
            .then(watcher.checkDirectoryLength)
            .then(watcher.onAdd)
            .catch(function(error) {
                return
            })
        }
    }

    /**
     * Reads a given directory
     * 
     * @param {String} directory The directory to read.
     * @returns {Object} Returns directory data.
     */
    function readDirectory( directory ) {
        return fs.readdirAsync(directory)
        .then(function( files ) {
            return {
                "DirectoryName": directory,
                "Files": files
            }
        })
        .catch(function( error ) {
            return error
        })
    }
    /**
     * Checks the length of @liveDirectories and proceses @directoryData.
     * If script is on first execution it will create an array of live directories.
     * Otherwise it will get the files added to a directory.
     * 
     * @param {Object} directoryData The object to process.
     * @returns {Promise} filesAdded The Promised Array.  
     */
    function checkDirectoryLength( directoryData ) {
        return new Promise(function( resolve, reject ) {
            if ( directoryData.length === 1) {
                fileCount = directoryData["0"].Files.length
            } else {
                var fileCount = watcher.getTotalFileCount(directoryData)
            }
            if ( watcher.liveDirectories.length === 0 ) {
                directoryData.forEach(createLiveDirectory)
            } else if ( watcher.liveDirectories.length > 0 && fileCount > watcher.prevFileCount ) {
                watcher.prevFileCount = fileCount
                resolve(getFilesAdded(directoryData))
            }
        })
    }
    /**
     * Adds the given directory to the @liveDirectories array.
     * 
     * @param {Object} directory The object to process.
     * @returns {Object} Returns directory added to the live directory array.
     */
    function createLiveDirectory( directory ) {
        return watcher.liveDirectories.push(
            {
                "DirectoryName": directory.DirectoryName,
                "NumOfFiles": 0
            }
        )
    }
    /**
     * Iterates over @liveDirectories and creates a {Map} to each live directory.
     * Uses the {Map} of live directories whilst iterating over @directoryData to get files added to a given directory. 
     * 
     * @param {Object} directoryData The object to process.
     * @returns {Array} Returns filesAdded
     */
    function getFilesAdded( directoryData ) {
        var directoryMap = new Map()
        _.each(watcher.liveDirectories, function( liveDirectory ) {
            directoryMap.set(liveDirectory.DirectoryName, liveDirectory)
        })
        filesAdded = _.map(directoryData, function( directory ) {
            var liveDirectory = directoryMap.get(directory.DirectoryName)
            if ( directory.Files.length > liveDirectory.NumOfFiles ) {
                var fileArray = []
                var filesAdded = []
                numOfFilesAdded = directory.Files.length - liveDirectory.NumOfFiles
                fileArray = watcher.orderByTimeAdded(directory.Files, directory.DirectoryName)
                watcher.iterateFiles(numOfFilesAdded, fileArray, filesAdded)
                liveDirectory.NumOfFiles = directory.Files.length
                return filesAdded
            }
        })
        filesAdded = watcher.flatten(filesAdded)
        return _.sortBy(filesAdded, 'FileName')
    }
    /**
     * Creates an {Object} for each file within a given directory adds this to the statArray
     * 
     * @param {Array} files The array to process 
     * @param {String} directory The string used to create a file path.
     * @returns {Object} Returns file added to the statArray
     */
    function orderByTimeAdded( files, directory ) {
        watcher.statArray = []
        _.each(files, function(file) {
            var fileStats = fs.statSync(directory + "/" + file)
            watcher.statArray.push(
                {
                    "FileName": file,
                    "AddedTime": fileStats.ctime,
                    "Directory" : directory
                }
            )
        })
        return _.sortBy(watcher.statArray, 'AddedTime').reverse()
    }
    /**
     * Adds the files that have been added to a directory to the filesAdded array.
     * 
     * @param {Number} numOfFilesAdded The number of files added
     * @param {Array} fileArray The array of current files within a directory.
     * @param {Array} filesAdded The array of files added
     */
    function iterateFiles( numOfFilesAdded, fileArray, filesAdded ) {
        fileArray.slice(0, numOfFilesAdded).forEach(watcher.pushToArray(filesAdded))
    }
    /**
     * Returns a function that adds a given item to an array.
     * 
     * @param {Array} array The array. 
     * @returns {Function} The function that adds a given item to the array.
     */
    function pushToArray( array ) {
        return function( item ) {
            array.push(item)
        }
    }
    /**
     * Reduces each File array for each directory within the directoryData object to a single array,
     * then returns the length of this array.
     * 
     * @param {Object} directoryData The object to process.
     * @returns {Number} TotalFileCount The number of files in all directories.
     */
    function getTotalFileCount( directoryData ) {
        return directoryData.reduce(function( acc, object ) {
            return acc.Files.concat(object.Files, [])
        }).length
    }
    /**
     * Reduces the given array of arrays, and returns an array containing all values contained within these arrays.
     * 
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns flattened array.
     */
    function flatten( array ) {
        return array.reduce(function(acc, val) {
            return acc.concat(Array.isArray(val) ? flatten(val) : val)
        }, [])
    }
    /**
     * Iterates over each files within the files array, and logs the FileName to the console.
     * 
     * @param {Array} files The array of files to log. 
     */
    function iterateAndLog( files ) {
        _.each(files, function( file ) {
            console.log(file.FileName)
        })
    }
    var watcher = {
        Watch: Watch,
        onAdd: onAdd,
        WatchDirs : [],
        IntervalTime : 0,
        statArray: statArray,
        liveDirectories: liveDirectories,
        prevFileCount: prevFileCount,
        watcherOnTheWall: watcherOnTheWall,
        readDirectory: readDirectory,
        checkDirectoryLength, checkDirectoryLength,
        createLiveDirectory: createLiveDirectory,
        getFilesAdded: getFilesAdded,
        orderByTimeAdded: orderByTimeAdded,
        iterateFiles: iterateFiles,
        pushToArray: pushToArray,
        getTotalFileCount: getTotalFileCount,
        flatten: flatten,
        iterateAndLog: iterateAndLog,
    }
    return watcher 
}());

module.exports = nightsWatch;