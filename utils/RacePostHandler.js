var controller = require('../controllers').race;
var horsePostHandler = require('../utils/HorsePostHandler');
var Promise = require('bluebird');
var _ = require('underscore');

var Horse = require('../models/Horse');
var Race = require('../models/Race');

Promise.promisifyAll(Race)

module.exports = (function() {
    var data;
    function errorHandler( error ) {
        return { message: "fail", data: error }
    }
    function callUpdate( race, raceEntity ) {
        if ( Array.isArray(raceEntity) ) {
            return controller.update(race, raceEntity["0"])
        }
    }
    function doesRaceExist( meetingEntity, raceEntity, race ) {
        if ( raceEntity.length === 0 ) {
            entity = controller.create(race, meetingEntity)
            return entity
        } else {
            return callUpdate(race, raceEntity)
        }
    }
    function getMeeting( promise ) {
        return promise.then(function( countryEntity ) {
            return countryEntity
        })
    }
    // Need to test this to see if raceEntity is still passed
    function createHorseEntities( raceEntity ) {
        promises = horsePostHandler.init(raceEntity, race.Horse)
        _.each(promises, function( promise ){
            promise.then(function( entity ){
                if ( raceEntity.horses.length === 0 ) {
                    controller.update({ "horseUpdate": true, "horseEntity": entity }, raceEntity)
                }
            })
        })
        return raceEntity
    }
    function init( object ) {
        handler.data = object.data.PARaceCardObject ? object.data.PARaceCardObject : object.data.PABettingObject;
        racePromises = _.map(handler.data.Meeting.Race, function( race ) {
            return Promise.all([ getMeeting(object.promise), controller.find({ x_reference: race.ID }) ])
            .spread(function( meetingEntity, raceEntity ) {
                return doesRaceExist(meetingEntity, raceEntity, race)
            })
            .then(createHorseEntities)
            .catch(errorHandler)
        })
        return racePromises
    }
    var handler = {
        init: init,
        data: data
    }
    return handler;
}());