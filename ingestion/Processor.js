var ingestionScripts = require('../ingestion'),
    processXml = ingestionScripts["processXml"],
    initializeBettingObject = ingestionScripts["initializeBettingObject"],
    setBettingValues = ingestionScripts["setBettingValues"],
    checkCountryCode = ingestionScripts["checkCountryCode"],
    zafWatcher = ingestionScripts["nightsWatch"],
    util = require('util'),
    Promise = require('bluebird'),
    _ = require('underscore')

var processor = {
    filePath : "",
    getFilePaths : function( files ) {
        var filePaths = files.map(function(fileData){
            return fileData.Directory + "/" + fileData.FileName
        })
        filePaths.forEach(processor.parseFile)
    },
    parseFile : function( path ) {
        filePath = path
        validXml = processXml.readXML(path),
        processXml.parseXML(validXml)
        .then(processor.checkPathAndProcess)
        .catch(function( error ){
            console.log(error)
        })
    },
    checkPathAndProcess : function( parsedXml ) {
        var expression = new RegExp(/betting/)
         if (expression.test(filePath)) {
            initializeBettingObject.init(parsedXml)
            .then(checkCountryCode)
            .then(function( data ) {
                console.log(util.inspect(data, false, null))
            })
            .catch(function(error) {
                console.log("\n" + error.Error + "\: " + error.Action);
            });
        } else {
            //Add ingestions scripts for race cards here
        }
    }
}

zafWatcher.WatchDirs = ["./zaf/betting"]
zafWatcher.IntervalTime = 500   
zafWatcher.onAdd = processor.getFilePaths
zafWatcher.watch();

