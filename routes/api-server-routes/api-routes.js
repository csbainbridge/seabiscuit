var express = require('express');
var router = express.Router();
// var controller = require('../');

router.get('/:resource', function(req, res, next) {
    var resource = req.params.resource
    switch(resource) {
        case "country":
            res.json({
                message: "success",
                resource: resource
            })
            break;
        case "meeting":
            res.json({
                message: "success",
                resource: resource
            })
            break;
        case "race":
            res.json({
                message: "success",
                resource: resource
            })
            break;
        case "stream":
            res.json({
                "message": "success",
                resource: resource
            })
    }
})

router.get('/:resource/:id', function(req, res, next) {
    var resource = req.params.resource
    var id = req.params.id
    switch(resource) {
        case "country":
            res.json({
                message: "success",
                resource: resource,
                id: id
            })
            break;
        case "meeting":
            res.json({
                message: "success",
                resource: resource,
                id: id
            })
            break;
        case "race":
            res.json({
                message: "success",
                resource: resource,
                id: id
            })
            break;
    }
})

 /**
 * Race data includes:
 * timestamps
 * jockeychanges
 * nonrunners
 * withdrawals
 * timestamps
 * horses
 * status'
 */
router.get('/:resource/:id/:data', function(req, res, next) {
    var resource = req.params.resource
    var id = req.params.id
    var data = req.params.data
    var query = req.query
    switch(resource) {
        case "meeting":
            res.json({
                message: "success",
                resource: resource,
                id: id,
                data: data,
            })
            break;
        case "race":
            if ( data == "horse" && req.query ) {
                res.json({
                    message: "success",
                    resource: resource,
                    id: id,
                    data: data,
                    horseID: query.id
                })
            } else {
                res.json({
                    message: "success",
                    resource: resource,
                    id: id,
                    data: data
                })
                break;
            }
           
    }
})

module.exports = router;

//TODO:
// // Posts via this route if the data is from race card files
// // In the controller we need to check if the coutry (parse id for country code) exists
// // in the db, if not create new country record which is then used to store all further related meetings.
// meetingRouter.post('/:meetingid', function(req, res) {
//     // Here we need to get the PA Race Card Object from the req.body
//     // Then convert the PA Race Card Object to JSON (JSON.parse)
//     res.json({
//         "Message": "Success",
//         "Meeting": req.params.meetingid
//     })
// })

// // Post via this route if the data is from betting files
// // Handle meeting updates in betting files
// meetingRouter.post('/update/:meeting', function(req, res) {
//     // here we need to get the PA Betting Object from the req.body
//     // Then convert the PA Betting Object Object to JSON (JSON.parse)
//     res.json({
//         "Message": "Success",
//         "Meeting": req.params.meetingid
//     })
// })