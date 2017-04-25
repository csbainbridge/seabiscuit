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
    getFilePaths : function( files ) {
        var filePaths = files
        .filter(function(i){return i != undefined})
        .map(function(fileData){
            return fileData.Directory + "/" + fileData.FileName
        })
        filePaths.forEach(processor.parseFile)
    },
    parseFile : function( path ) {
        validXml = processXml.readXML(path),
        processXml.parseXML(validXml)
        .then(function(processedXml) { 
            if ( (/betting/).test(path) ) {
                processor.postBetting(processedXml)
            } else if ( (/racecard/).test(path) ) {
                processor.postRaceCard(processedXml)
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
    postBetting : function( processedXml ) {
        initializeBettingObject.init(processedXml)
        .then(checkCountryCode)
        .then(function( json ) {
            console.log(util.inspect(json, false, null))
        })
        .catch(function(error) {
            console.log("\n" + error.Error + "\: " + error.Action);
        });
    },
    postRaceCard : function( processedXml ) {
        initializeRaceCardObject.init(processedXml)
        .then(setRaceCardValues.setPARaceCardValues)
        .then(function( json ) {
            console.log(util.inspect(json, false, null))
        })
        .catch(function( error ){
            console.log("\n" + error.Error + "\: " + error.Action)
        })
    }
}

zafWatcher.WatchDirs = ["./zaf/betting", './zaf/racecard']
zafWatcher.IntervalTime = 500   
zafWatcher.onAdd = processor.getFilePaths
zafWatcher.watch();
