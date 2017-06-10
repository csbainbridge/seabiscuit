/**
 * RacePostHandler handles race card and betting horse data from the POST request route to localhost:3000/country?name=country_name_value
 */

/**
 * Dependencies
 * @RaceController, @HorsePostHandler, @bluebird, @underscore
 */
var controller = require('../../controllers').race,
    handleError = require('../../utils/ErrorHandler').error
    horsePostHandler = require('../racecard/HorsePostHandler'),
    Promise = require('bluebird'),
    _ = require('underscore');

var Horse = require('../../models/Horse');
var Race = require('../../models/Race');

Promise.promisifyAll(Race)

module.exports = (function() {
    /**
     * Module globals
     * data - The JSON data object (PA Race Card or PA Betting)
     */
    var data;
    /**
     * Uses the race controller to update the race entity with the race object.
     * 
     * @param {Object} race The race object
     * @param {Array} raceEntity The race array that contains the race entity.
     * @returns {Promise} Returns the promised race object.
     */
    function callUpdate( race, raceEntity ) {
        if ( Array.isArray(raceEntity) ) {
            return controller.update(race, raceEntity["0"])
        }
    }
    /**
     * Checks if the race entity array contains any race objects.
     * When no entity exists creates a race entity.
     * When an entity already exists it is updated.
     * 
     * @param {Object} meetingEntity The meeting entity
     * @param {Object} raceEntity  The race entity
     * @param {Object} race The race object from the post data.
     * @returns {Promise} Returns the promised meeting object.
     */
    function doesRaceExist( meetingEntity, raceEntity, race ) {
        if ( raceEntity.length === 0 ) {
            entity = controller.create(race, meetingEntity)
            return entity
        } else {
            return callUpdate(race, raceEntity)
        }
    }
    /**
     * Thens the meeting promise and returns the meeting entity object.
     * 
     * @param {Promise} promise Promise containing the meeting entity object
     * @returns {Object} Returns the meeting entity object.
     */
    function getMeeting( promise ) {
        return promise.then(function( meetingEntity ) {
            return meetingEntity
        })
    }
    /**
     * Root function that sets the module global and gets the values from the object passed.
     * Uses the race controller to check if a race entity with the ID already exists.
     * If the race entity horses array does not contain any horses,
     * the horses in the racing data object are added to the corresponding race in the data store.
     * 
     * @param {Object} object The object containing the JSON racing data and the promised meeting entity object.
     * @returns {Array} Returns an array of race promises. 
     */
    function init( object ) {
        handler.data = object.data.PARaceCardObject ? object.data.PARaceCardObject : object.data.PABettingObject;
        racePromises = _.map(handler.data.Meeting.Race, function( race ) {
            return Promise.all([ 
                getMeeting(object.promise),
                controller.find({x_reference : race.ID}) 
            ])
            .spread(function( meetingEntity, raceEntity ) {
                return doesRaceExist(meetingEntity, raceEntity, race)
            })
            .then(function createHorseEntities(raceEntity) {
                promises = horsePostHandler.init(raceEntity, race.Horse)
                _.each(promises, function( promise ) {
                    promise.then(function( entity ) {
                        if ( raceEntity.horses.length === 0 ) {
                            controller.update({"horseUpdate": true, "horseEntity": entity }, raceEntity)
                        }
                    })
                })
                return raceEntity
            })
            .catch(handleError)
        })
        return racePromises
    }
    /**
     * Object to return when the module function is called.
     */
    var handler = {
        init: init,
        data: data
    }
    return handler;
}());