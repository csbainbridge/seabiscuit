var ingestionScripts = require('../ingestion'),
    processXml = ingestionScripts["processXml"],
    initializeBettingObject = ingestionScripts["initializeBettingObject"],
    setBettingValues = ingestionScripts["setBettingValues"],
    checkCountryCode = ingestionScripts["checkCountryCode"],
    zafWatcher = ingestionScripts["nightsWatch"],
    util = require('util')

var ingest = {
    watcherProcess : function( files ) {
        filePaths = []; 
        for (i=0;i<files.length-1;i++) {
            filePaths.push(files[i].Directory+"/"+files[i].FileName)
        }
        filePaths.forEach(function(path){
            validXml = processXml.readXML(path)
            processXml.parseXML(validXml)
            .then( initializeBettingObject.init )
            .then( checkCountryCode )
            .then(function ( data ) {
                console.log(util.inspect(data, false, null))
            })
            .catch( function( error ) {
                console.log(
                        "\n" + error.Error
                        + "\: " + error.Action
                    );
            });
        })
    }
}

zafWatcher.WatchDirs = ["./zaf/betting", "./zaf/racecard"]
zafWatcher.IntervalTime = 500   
zafWatcher.onAdd = ingest.watcherProcess
zafWatcher.Watch();

