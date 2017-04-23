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
        for (i=0;i<files.length;i++) {
            filePaths.push(files[i].Directory+"/"+files[i].FileName)
        }
        console.log(filePaths)
        filePaths.forEach(function(path){
            var re = new RegExp(/betting/)
            validXml = processXml.readXML(path)
            if (re.test(path)) {
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
            } else {
                //Add ingestions scripts for race cards here
            }
        })
    }
}

zafWatcher.WatchDirs = ["./zaf/betting"]
zafWatcher.IntervalTime = 500   
zafWatcher.onAdd = ingest.watcherProcess
zafWatcher.Watch();

