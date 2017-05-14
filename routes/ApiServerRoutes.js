var express = require('express'),
    controllers = require('../controllers'),
    countryPostHandler = require('../utils/CountryPostHandler'),
    meetingPostHandler = require('../utils/MeetingPostHandler'),
    racePostHandler = require('../utils/RacePostHandler'),
    response = require('../utils/response'),
    router = express.Router();

/**
 * Handles HTTP GET request for returning all entities related to the resource requested.
 * Current resources available: @Country, @Meeting, @Race, @Horse
 * 
 * @returns {Object} Returns success object with entities
 */
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

/**
 * Handles HTTP GET request for returning a single entity related to the resource requested based on the id value.
 * Current resources avalable: @Country, @Meeting, @Race, @Horse
 * 
 * @returns {Object} Returns success object with entity
 */
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

/** Handles HTTP POST request for creating and updating entities with data store
 *  At the moment there is only a specific resource and parameter that should be posted to this, 
 *  which will in turn update all resources in the data store.
 *  ROUTE: /country?name=country_name_value (Where the country name value is the name value within the racing data being submitted.)
 * 
 */
router.post('/:resource', function( req, res, next ) {
    var resource = req.params.resource
    var data = req.body
    var query = req.query
    var controller = controllers[resource]
    var entities = 0;
    if ( controller == null ) {
        response.invalid(res)
    }

    countryPromise = countryPostHandler.checkEntities(query, data, controller)
    meetingPromise = meetingPostHandler.init({promise: countryPromise, data: data})


    racePromises = racePostHandler.init({promise: meetingPromise, data: data})
    meetingPostHandler.iterateRacePromises(racePromises)

    countryPostHandler.addMeetings( meetingPromise )

    // TODO: NOW GET THE MEETING FROM THE MEETING PROMISE AND PASS IT TO THE ADD MEETINGS FUNCTION OF
    // THE COUNTRY POST HANDLER
})

module.exports = router;