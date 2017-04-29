var express = require('express');
var countryRouter = express.Router();

// Returns all countries for the current raceday
countryRouter.get('/', function(req, res){
    res.json({
        "Message": "Success",
        "Countries": "All"
    })
})

// Returns all meetings for the given country
countryRouter.get('/:countryid', function(req, res){
    date = req.query
    res.json({
        "Message": "Success",
        "Country": req.params.countryid,
    })
})

module.exports = countryRouter;