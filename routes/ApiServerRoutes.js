var express = require('express');
var controllers = require('../controllers');
var countryPostHandler = require('../utils/CountryPostHandler');
var meetingPostHandler = require('../utils/MeetingPostHandler');
var racePostHandler = require('../utils/RacePostHandler');
var response = require('../utils/response');
// var apiPostHandler = require('../utils/APIPostHandler.js');
var router = express.Router();

router.get('/:resource', function( req, res, next ) {
    var resource = req.params.resource
    var controller = controllers[resource]
    if (controller == null ) {
        response.invalid(res)
    }
    controller.find(req.query)
    .then(function( entities ) {
        response.success(res, entities)
    })
    .catch(function( error ) {
        response.error(res, error)
    })
})

router.get('/:resource/:id', function( req, res, next ) {
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

router.post('/:resource', function( req, res, next ) {
    var resource = req.params.resource
    var data = req.body
    var query = req.query
    var controller = controllers[resource]
    var entities = 0;
    if ( controller == null ) {
        response.invalid(res)
    }

    //TODO: If there are any problems with handling both racecard and betting data for example Country should only be created when race cards
    countryPromise = countryPostHandler.checkEntities(query, data, controller)
    meetingPromise = meetingPostHandler.init({promise: countryPromise, data: data})

    /**
     * 1) Iterate over each race
     * 2) Calling the racePostHandler passing in the race data and the meetingPromise
     * 3) We need the meeting promise to set the _meeting cross reference id in the race document
     * which will allow us to populate the meeting document with races
     */

    
    racePostHandler.init({promise: meetingPromise, data: data}).then(function( response ){
        res.json(response)
    })

    // TODO: Need to store the meetingPostHandler returned promise in a variable
    // TODO: Then we need to call the init method of the racePostHandler method passing in the meeting promise, and data
})

module.exports = router;