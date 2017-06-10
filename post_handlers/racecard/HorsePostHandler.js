/*
* HorsePostHandler handles race card and betting horse data from POST request to route localhost:3000/country?name=country_name_value
*/

/**
 * Dependencies
 * @underscore, @HorseController, @bluebird, @ErrorHandler
 */

var controller = require('../../controllers').horse,
    handleError = require('../../utils/ErrorHandler').error,
    Promise = require('bluebird'),
    _ = require('underscore');

module.exports = (function() {
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
     * Checks if the horse entity array contains any horse objects
     * When no entity exists creates a horse entity.
     * When an entity already exists it is updated. 
     * 
     * @param {Object} raceEntity The race entity
     * @param {Object} horseEntity The horse entity
     * @param {Object} horse The horse object from the post data
     * @returns {Promise} Returns promised horse object.
     */
    function doesHorseExist( raceEntity, horseEntity, horse ) {
        if ( horseEntity.length === 0 ) {
            entity = controller.create(horse, raceEntity)
            return entity
        } else {
            return callUpdate(horse, horseEntity)
        }
    }
    /**
     * Root function that iterates over the horse array, and uses the controller and the horse name to find a matching entity.
     * 
     * @param {Object} raceEntity 
     * @param {Array} horseArray
     * @returns {Array} Returns an array of promised horse objects.
     */
    function init( raceEntity, horseArray ) {
        promises = _.map(horseArray, function( horse ) {
            return controller.find({name: horse.Name})
            .then(function(horseEntity){
                return doesHorseExist(raceEntity, horseEntity, horse)
            })
            .catch(handleError)
        })
        return promises
    }
    /**
     * Object to return when module function is called.
     */
    var handler = {
        init: init
    }
    return handler
}());