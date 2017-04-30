/**
 * Subscriptions are provided by the api server.
 */

var express = require('express');
var router = express.Router();

// Need to create a subcription channel to publish Server Side Events to subscribed clients
// These will allow us to push notifications for all races and display a UI based notification to the user.
router.get('/:subscriptiontype', function(req, res, next) {
    if ( req.params.subscriptiontype == "betting" ) {
        res.json({
            messsage: "Success",
            subscribed: "Yes",
            type: req.params.subscriptiontype        
        })
    } else if ( req.params.subscriptiontype == "racecard" ) {
        res.json({
            message: "Success",
            subscribed: "Yes",
            type: req.params.subscriptiontype
        })
    }
})

module.exports = router;