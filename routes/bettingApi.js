var express = require('express');
var router = express.Router();

/**
 * Routes
 * 
 * Viewer is dependant on the below routes;
 * /
 * /country/countryid/
 * /race/raceid
 * 
 * Other routes
 * 
 * 
 */

// Returns the dates where meetings have been scheduled.
router.get('/', function(req, res) {
  var date = new Date()
  res.send({
    "success": "dates",
    "dates": date
  })
})

// Returns all meetings and corresponding race times
router.get('/country/:countryid', function(req, res) {
  var countryId = req.params.countryid
  res.send({
    "success": "country id",
    "countryId": countryId
  })
})

// Returns all race related data
router.get('/race/:raceid', function(req, res) {
  var raceId = req.params.raceid
  res.send({
    "success": "race id",
    "raceid": raceId
  })
})

// Returns all race status and their corresponding timestamps
router.get('/race/:raceid/status', function(req, res) {
  var raceId = req.params.raceid
  res.send({
    "success": "race status'",
    "raceid": raceId
  })
})

// Returns all race non runners and their coressponding timestamps
router.get('/race/:raceid/nonrunners', function(req, res) {
  var raceId = req.params.raceid
  res.send({
    "success": "race nonrunners",
    "raceid": raceId
  })
})

// Returns all race withdrawals and their corresponding timestamps
router.get('/race/:raceid/withdrawals', function(req, res) {
  var raceId = req.params.raceid
  res.send({
    "success": "race withdrawals",
    "raceid": raceId
  })
})

// Returns all jockey changes and their corresponding timestamps
router.get('/race/:raceid/jockeychanges', function(req, res) {
  var raceId = req.params.raceid
  res.send({
    "success": "race jockeychanges",
    "raceid": raceId
  })
})

// Returns all data for a horse in a given race
router.get('/race/:raceid/:horseid', function(req, res) {
  var raceId = req.params.raceid
  var horseId = req.params.horseid
  res.send({
    "success": "horse data",
    "raceid": raceId,
    "horseid": horseId
  })
})

// Returns all race changes and their corresponding timestamps
router.get('/race/:raceid/timestamps', function(req, res) {
  var raceId = req.params.raceid
  res.send({
    "success": "timestamps",
    "raceid": raceId
  })
})

module.exports = router;
