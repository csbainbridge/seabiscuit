/**
 * Processor sends betting and race card data to the API.
 */
var ingestionScripts = require('../ingestion'),
    processXml = ingestionScripts["processXml"],
    initializeBettingObject = ingestionScripts["initializeBettingObject"],
    initializeRaceCardObject = ingestionScripts["initializeRaceCardObject"]
    setBettingValues = ingestionScripts["setBettingValues"],
    setRaceCardValues = ingestionScripts["setRaceCardValues"]
    checkCountryCode = ingestionScripts["checkCountryCode"],
    zafWatcher = ingestionScripts["nightsWatch"],
    util = require('util')

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
            return fileData.Directory + "/" + fileData.FileName
        })
        filePaths.forEach(processor.parseFile)
    },
    /**
     * Processes the xml file at the passed file path, checking whether the path provided contains a race card or betting directory.
     * 
     * @param {String} path The file path
     */
    parseFile : function( path ) {
        validXml = processXml.readXML(path),
        processXml.parseXML(validXml)
        .then(function(processedXml) { 
            if ( (/betting/).test(path) ) {
                processor.saveBetting(processedXml)
            } else if ( (/racecard/).test(path) ) {
                processor.saveRaceCard(processedXml)
            } else {
                throw error({
                    "Error": "Invalid directory configuration.",
                    "Action": "Accepted subdirectories '/betting/' and '/racecard/. Example: zaf/betting and zaf/racecard."
                })
            }
        })
        .catch(function( error ) {
            console.log("\n" + error.Error + "\: " + error.Action)
        })
    },
    /**
     * Converts betting xml data to json format and calls betting api.
     * 
     * @param {String} processedXml The contents of the XML file as a string.
     */
    saveBetting : function( processedXml ) {
        initializeBettingObject.init(processedXml)
        .then(checkCountryCode)
        .then(function( json ) {
            console.log(JSON.stringify(json))
            //TODO: Once API is written add call to corresponding API function here.
            // Development Post URL: localhost:3000/race/:raceid
            // Production Post URL: seabiscuit.raceday.api/race/:raceid
            // If data is meeting only related data, for example weather and going:
            // Development Post URL: localhost:3000/meeting/update/:meeting
            // Production Post URL: seabiscuit.raceday.api/meeting/update/:meeting
        })
        .catch(function(error) {
            console.log("\n" + error.Error + "\: " + error.Action);
        });
    },
    /**
     * Converts race card xml data to json format and calls race card api.
     * 
     * @param {String} processedXml The contents of the XML file as a string.
     */
    saveRaceCard : function( processedXml ) {
        initializeRaceCardObject.init(processedXml)
        .then(setRaceCardValues.setPARaceCardValues)
        .then(function( json ) {
            console.log(JSON.stringify(json))
            //TODO: Once API is written add call to corresponding API function here.
            // Development Post URL: localhost:3000/meeting/:meetingid
            // Production Post URL: seabiscuit.raceday.api/meeting/:meetingid
        })
        .catch(function( error ){
            console.log("\n" + error.Error + "\: " + error.Action)
        })
    }
}

/**
 * Configuration: zafWatcher {Object}
 * WatchDirs: File system directories to process.
 * IntervalTime: How often to check the directories for new files.
 * onAdd: Function called when a new file is added to the directories.
 * watch(): Execute.
 */
zafWatcher.WatchDirs = ["./zaf/betting", './zaf/racecard']
zafWatcher.IntervalTime = 500   
zafWatcher.onAdd = processor.getFilePaths
zafWatcher.watch();
