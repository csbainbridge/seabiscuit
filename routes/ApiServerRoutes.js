var express = require('express');
var controllers = require('../controllers');
var countryPostHandler = require('../utils/CountryPostHandler');
var meetingPostHandler = require('../utils/MeetingPostHandler');
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
    countryPromise = countryPostHandler.checkEntities(query, data, controller)
    meetingPostHandler.init({promise: countryPromise, data: data}).then(function(response){
        res.json(response)
    })
})

module.exports = router;