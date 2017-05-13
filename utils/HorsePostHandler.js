/*
* HorsePostHandler handles race card and betting horse data from POST request to route localhost:3000/country?name=country_name_value
*/

/**
 * Dependencies
 * @underscore, @HorseController, @bluebird
 */

var controller = require('../controllers').horse,
    Promise = require('bluebird'),
    _ = require('underscore');

module.exports = (function() {
    /**
     * Returns error object
     * 
     * @param {String} error The stack trace for the error.
     * @return {Object} Returns the error object.
     */
    function errorHandler( error ) {
        return { message: "fail", data: error }
    }
    /**
     * Uses the horse controller to update the horse entity with the horse object.
     * 
     * @param {Object} horse The horse object
     * @param {Array} horseEntity The array that contains the horse entity.
     * @returns {Promise} Returns the promised horse object. 
     */
    function callUpdate( horse, horseEntity ) {
        if ( Array.isArray(horseEntity) ) {
            return controller.update(horse, horseEntity["0"])
        }
    }
    /**
     * 
     * @param {*} raceEntity 
     * @param {*} horseEntity 
     * @param {*} horse 
     */
    function doesHorseExist( raceEntity, horseEntity, horse ) {
        if ( horseEntity.length === 0 ) {
            entity = controller.create(horse, raceEntity)
            return entity
        } else {
            return callUpdate(horse, horseEntity)
        }
    }
    function init( raceEntity, horseArray ) {
        promises = _.map(horseArray, function( horse ) {
            return controller.find({name: horse.Name})
            .then(function(horseEntity){
                return doesHorseExist(raceEntity, horseEntity, horse)
            })
        })
        return promises
    }
    var handler = {
        init: init
    }
    return handler
}());