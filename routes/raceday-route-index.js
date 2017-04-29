var countryAPIRouter = require('./raceday-api-routes/countries');
var raceAPIRouter = require('./raceday-api-routes/races');
var meetingAPIRouter = require('./raceday-api-routes/meetings');
var raceSubscriptionRouter = require('./raceday-subscription-routes/races')
var express = require('express');
var router = express.Router();

router.use('/subscribe', raceSubscriptionRouter)
router.use('/country', countryAPIRouter)
router.use('/meeting', meetingAPIRouter)
router.use('/race', raceAPIRouter)

module.exports = router