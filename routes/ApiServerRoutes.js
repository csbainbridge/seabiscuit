var express = require('express');
var controllers = require('../controllers');
var countryPostHandler = require('../utils/CountryPostHandler');
var response = require('../utils/response');
// var apiPostHandler = require('../utils/APIPostHandler.js');
var router = express.Router();

router.get('/:resource', function(req, res, next) {
    var resource = req.params.resource
    var controller = controllers[resource]
    if (controller == null ) {
        response.invalid(res)
    }
    controller.find(req.query)
    .then(function(entities) {
        response.success(res, entities)
    })
    .catch(function(error) {
        response.error(res, error)
    })
})

router.get('/:resource/:id', function(req, res, next) {
    var resource = req.params.resource
    var id = req.params.id
    var controller = controllers[resource]
    if ( controller == null ) {
       response.invalid(res)
    }
    controller.findById(id)
    .then(function( entity ) {
        response.success(res, entity)
    })
    .catch(function( error ) {
        response.notFound(res, resource)
    })
})

router.post('/:resource', function(req, res, next) {
    var resource = req.params.resource
    var data = req.body
    var query = req.query
    var controller = controllers[resource]
    var entities = 0;
    if ( controller == null ) {
        response.invalid(res)
    }
    /**
     * TODO: This needs moving to a RaceCardPosthandler.js
     * RaceCardPostHandler.js will take in all controllers an a parameter, even though this will reduce
     * efficiency it will allow the script to compose together 
     */

    countryPostHandler.checkEntities(query, data, controller)
    .then(function(response){
        console.log(response)
        // Maybe it would be best to create ApiPostHandler for Racecard
        // TODO: Now need to create meetings using the meeting controller
        controller = controllers["meeting"]
        controller.create(data, response).then(function(meetingDocument){
            controller.update(data, meetingDocument).then(function(success){
                console.log(success)
            })
        
        })
        // Sort this out now
        res.json(response)
    })

    // apiPostHandler.findOrCreate(req.query, data, controller)
    // .then(function(response){
    //     res.send(response)
    // });
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