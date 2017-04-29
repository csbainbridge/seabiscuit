var express = require('express');
var meetingRouter = express.Router();

// Returns all data related to a specific meeting
meetingRouter.get('/:meetingid', function(req, res) {
    res.json({
        "Message": "Success",
        "Meeting": req.params.meetingid
    })
})

// Posts via this route if the data is from race card files
// In the controller we need to check if the coutry (parse id for country code) exists
// in the db, if not create new country record which is then used to store all further related meetings.
meetingRouter.post('/:meetingid', function(req, res) {
    // Here we need to get the PA Race Card Object from the req.body
    // Then convert the PA Race Card Object to JSON (JSON.parse)
    res.json({
        "Message": "Success",
        "Meeting": req.params.meetingid
    })
})

// Post via this route if the data is from betting files
// Handle meeting updates in betting files
meetingRouter.post('/update/:meeting', function(req, res) {
    // here we need to get the PA Betting Object from the req.body
    // Then convert the PA Betting Object Object to JSON (JSON.parse)
    res.json({
        "Message": "Success",
        "Meeting": req.params.meetingid
    })
})

module.exports = meetingRouter;