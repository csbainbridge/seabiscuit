var controller = require('../controllers').race;
var Promise = require('bluebird');
var _ = require('underscore');

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
    function init( object ) {
        handler.data = object.data.PARaceCardObject ? object.data.PARaceCardObject : object.data.PABettingObject;
         /**
         * 1) Iterate over each race
         * 2) Calling the racePostHandler passing in the race data and the meetingPromise
         * 3) We need the meeting promise to set the _meeting cross reference id in the race document
         * which will allow us to populate the meeting document with races
         * 4) We need to iterate over the Horse array whilst iterating over the race array
         */
        arr = _.map(handler.data.Meeting.Race, function( race ){
            Promise.all([getMeeting(object.promise), controller.find({x_reference: race.ID})])
            .spread(function( meetingEntity, raceEntity ) {
                return doesRaceExist(meetingEntity, raceEntity, race)
            })
            .catch(errorHandler)
            // return race;
        })




        
        // return Promise.all([getMeeting(object.promise), controller.find({})])
    }
    var handler = {
        init: init,
        data: data
    }
    return handler;
}());