// var countryAPIRouter = require('./raceday-api-routes/countries');
// var raceAPIRouter = require('./raceday-api-routes/races');
// var meetingAPIRouter = require('./raceday-api-routes/meetings');

var api = require('./api-server-routes/api-routes')
var raceSubscriptionRouter = require('./api-server-routes/subscription-routes')


var express = require('express');
var router = express.Router();

router.use('/', api)
router.use('/subscribe', raceSubscriptionRouter)

// router.use('/country', countryAPIRouter)
// router.use('/meeting', meetingAPIRouter)
// router.use('/race', raceAPIRouter)

module.exports = router