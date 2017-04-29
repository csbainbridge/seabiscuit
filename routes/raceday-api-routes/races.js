var express = require('express');
var raceRouter = express.Router();

// Returns all race related data
raceRouter.get('/:raceid', function(req, res) {
    res.send({
        "Message": "Success",
        "Race": req.params.raceid
    })
})

// Handles live betting data posted from ingestion script
raceRouter.post('/:raceid', function(req, res) {
    // Here we set up a publisher that will publish the live betting data
    // After calling the controller save method
    // We will publish to all clients who are subscribes to the race channel
    // ALTERNATIVES
    // WebSocket API (But we don't really need since the client is not sending data to the server)
    // Long Polling (Great for REST API framework)
    console.log(req)
})

// Returns all status' and their corresponding time stamps
raceRouter.get('/:raceid/status', function(req, res) {
    res.json({
        "Message": "Success",
        "Route": "Status",
        "Race": req.params.raceid
    })
})

// Returns all non runner related data
raceRouter.get('/:raceid/nonrunner', function(req, res) {
    res.json({
        "Message": "Success",
        "Route": "NonRunner",
        "Race": req.params.raceid
    })
})

// Returns all jockey change related data
raceRouter.get('/:raceid/jockeychange', function(req, res) {
    res.json({
        "Message": "Success",
        "Route": "JockeyChange",
        "Race": req.params.raceid
    })
})

// Returns all withdrawal related data
raceRouter.get('/:raceid/withdrawals', function(req, res) {
    res.json({
        "Message": "Success",
        "Route": "Withdrawals",
        "Race": req.params.raceid
    })
})

// Returns all timestamps
raceRouter.get('/:raceid/timestamps', function(req, res) {
    res.json({
        "Message": "Success",
        "Route": "TimeStamps",
        "Race": req.params.raceid
    })
})

// Returns horse related data.
raceRouter.get('/:raceid/:horseid', function(req, res) {
    res.json({
        "Message": "Success",
        "Route": "Horse",
        "Race": req.params.raceid,
        "Horse": req.params.horseid
      
    })
})

module.exports = raceRouter;