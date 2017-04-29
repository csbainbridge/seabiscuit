/**
 * Subscriptions are provided by the api server.
 */

var express = require('express');
var subscriptionRouter = express.Router();

// Need to create a subcription channel to publish Server Side Events to subscribed clients
// These will allow us to push notifications for all races and display a UI based notification to the user.
subscriptionRouter.get('/betting', function(req, res) {
    res.json({
        "Message": "Success",
        "Subscribed": "Yes",
        "To": "Betting Updates"
    })
})

subscriptionRouter.get('/racecard', function(req, res) {
    res.json({
        "Message": "Success",
        "Subscribed": "Yes",
        "To": "Racecard Updates"
    })
})

subscriptionRouter.get('/:raceid', function(req, res) {
    res.json({
        "Message": "Success",
        "Subscribed": "Yes",
        "To": req.params.raceid
    })
})

module.exports = subscriptionRouter;