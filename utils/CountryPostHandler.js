var _ = require('underscore');
var countryController = require('../controllers').country;

module.exports = (function() {
    var query;
    var data;
    var controller;
    function errorHandler( error ) {
        return { message: "fail", data: error }
    }
    function doesEntityExist( entities ) {
        if ( entities.length === 0 ) {
            return countryPostHandler.controller
            .create(countryPostHandler.data)
            .catch(errorHandler)
        } else {
            return entities["0"]
        }
    }
    function addMeetings() {
        // TODO: Complete this function
    }
    function checkEntities( query, data, controller ) {
        var response;
        countryPostHandler.query = query;
        countryPostHandler.data = data;
        countryPostHandler.controller = controller;
        response = countryPostHandler.controller
        .find(countryPostHandler.query)
        .then(doesEntityExist)
        .catch(errorHandler)
        return response;
    }
    var countryPostHandler = {
       checkEntities: checkEntities,
       query: query,
       data: data,
       controller: controller,
       addMeetings: addMeetings
    }
    return countryPostHandler;
}());