/**
 * Processor sends betting and race card data to the API.
 */
var ingestionScripts = require('../ingestion'),
    processXml = ingestionScripts["processXml"],
    initializeBettingObject = ingestionScripts["initializeBettingObject"],
    initializeRaceCardObject = ingestionScripts["initializeRaceCardObject"]
    setBettingValues = ingestionScripts["setBettingValues"],
    setRaceCardValues = ingestionScripts["setRaceCardValues"],
    checkCountryCode = ingestionScripts["checkCountryCode"],
    zafWatcher = ingestionScripts["nightsWatch"],
    httpWorker = require('../utils/HttpRequestWorker'),
    util = require('util')

var request = require('request');

var processor = {
    /**
     * Creates a new array of file paths for each file in the files array.
     * Each file path in the new array is then iterated over.
     * 
     * @param {Array} files An array of file data.
     */
    getFilePaths : function( files ) {
        var filePaths = files
        .filter(function(item){return item != undefined})
        .map(function(fileData){
            //TODO: Use a regular expression to check if the files ends with .xml instead of .DS_Store
            if ( fileData.FileName !== ".DS_Store" ) {
                return fileData.Directory + "/" + fileData.FileName
            }
        })
        processor.postRaceDataSynchronously(filePaths)
    },
    postRaceDataSynchronously : function( filePaths ) {
        var filePath = filePaths.pop();
        validXml = processXml.readXML(filePath)
        processXml.parseXML(validXml, filePath).then(function( processedXml ) {
            if ( (/betting/).test(filePath) ) {
                processor.postBetting(processedXml, filePath, filePaths)
            } else if ( (/racecard/).test(filePath) ) {
                processor.postRaceCard(processedXml, filePath, filePaths)
            }
        }).catch(function( error ) {
            console.log(new Date() + "\n" + error.Error + "\nAction: " + error.Action)
        })
    },
    /**
     * Converts betting xml data to json format and POSTs to seabiscuit api server
     * 
     * @param {String} processedXml The contents of the XML file as a string.
     */
    postBetting : function( processedXml, filePath, filePaths) {
        initializeBettingObject.init(processedXml)
        .then(checkCountryCode)
        .then(function( json ) {
            request({
                url: 'http://localhost:8080/country?name=' + json.PABettingObject.Meeting.Country + '&type=betting',
                method: 'POST',
                body: json,
                json: true
            }, function( error, response, body ) {
                if ( filePaths.length ) {
                    processor.postRaceDataSynchronously(filePaths)
                } else {
                    console.log(new Date() + " " + body.data + " from " + filePath + " POSTed successfully")
                }
            })
        })
        .catch(function( error ) {
            console.log(new Date() + "\n" + error.Error + "\: " + error.Action);
        });
    },
    /**
     * Converts race card xml data to json format and POSTs to seabiscuit api server.
     * 
     * @param {String} processedXml The contents of the XML file as a string.
     */
    postRaceCard : function( processedXml, filePath, filePaths, message ) {
        initializeRaceCardObject.init(processedXml)
        .then(setRaceCardValues.setPARaceCardValues)
        .then(function( json ) {
            request({
                url: 'http://localhost:8080/country?name=' + json.PARaceCardObject.Meeting.Country + '&type=racecard',
                method: 'POST',
                body: json,
                json: true
            }, function( error, response, body) {
                if ( filePaths.length ) {
                    processor.postRaceDataSynchronously(filePaths)
                } else {
                    console.log(new Date() + " " + body.data + " from " + filePath + " POSTed successfully")
                }
            })
        })
        .catch(function( error ) {
            console.log(new Date() + "\n" + error.Error + "\: " + error.Action);
        })
    },
}

/**
 * Configuration: zafWatcher {Object}
 * WatchDirs: File system directories to process.
 * IntervalTime: How often to check the directories for new files.
 * onAdd: Function called when a new file is added to the directories.
 * watch(): Execute.
 */
zafWatcher.WatchDirs = ["./ingestion/zaf/betting", './ingestion/zaf/racecard']
zafWatcher.IntervalTime = 500   
zafWatcher.onAdd = processor.getFilePaths
zafWatcher.watch();