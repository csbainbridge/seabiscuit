var express = require('express'),
    controllers = require('../controllers'),
    countryPostHandler = require('../post_handlers/racecard/CountryPostHandler'),
    meetingPostHandler = require('../post_handlers/racecard/MeetingPostHandler'),
    racePostHandler = require('../post_handlers/racecard/RacePostHandler'),
    bettingPostHandler = require('../post_handlers/betting/BettingPostHandler'),
    response = require('../utils/response'),
    router = express.Router();


/**
 * Handles HTTP GET request for returning all entities related to the resource requested.
 * Current resources available: @Country, @Meeting, @Race, @Horse
 * 
 * @returns {Object} Returns success object with entities
 */
router.get('/:resource', function( req, res, next ) {
    var resource = req.params.resource,
        controller = controllers[resource]
    console.log(controller)
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
    var resource = req.params.resource,
        id = req.params.id,controller = controllers[resource]
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
//TODO: Need to find out if there is a way to import the instance of the websocket server here so that the data can be pushed to the client,
// currently I am pushing the entire database every second to the client, this might be tedius when implementing a notification system, as we wont be able to tell
// exactly what data has been changed.
router.post('/:resource', function( req, res, next ) {
    var resource = req.params.resource
    var data = req.body
    var countryName = req.query.name
    var dataFormat = req.query.type
    var controller = controllers[resource]
    var entities = 0;
    if ( controller == null ) {
        response.invalid(res)
    }
    if ( dataFormat === 'racecard') {
        countryPromise = countryPostHandler.init(countryName, data, controller)
        meetingPromise = meetingPostHandler.init({promise : countryPromise, data : data})
        racePromises = racePostHandler.init({promise : meetingPromise, data : data})
        meetingPostHandler.iterateRacePromises(racePromises)
        countryPostHandler.addMeetings( meetingPromise )
        .then(function( success ) {
            response.success(res, "racecard data")
        })
        .catch(function( error ) {
            response.error(res, error)
        })
    } else if ( dataFormat === 'betting' ) {
        bettingPostHandler.init(countryName, data)
        .then(function( success ) {
            response.success(res, "betting data")
        })
        .catch(function( error ) {
            response.error(res, error)
        })
    } else {
        response.error(res, "Expected data format 'racecard' or 'betting'")
    }
})

module.exports = router;