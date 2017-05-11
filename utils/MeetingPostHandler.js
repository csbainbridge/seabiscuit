var controller = require('../controllers').meeting;
var Promise = require('bluebird');
var _ = require('underscore')

module.exports = (function() {
    var data;
    function errorHandler( error ) {
        return { message: "fail", data: error }
    }
    function callUpdate( data, meetingEntity ) {
        if ( Array.isArray(meetingEntity) ) {
            return controller.update(data, meetingEntity["0"])
        } else {
            return meetingEntity.then(function( meetingEntity ) {
                return controller.update(data, meetingEntity)
            })
        }
    }
    function doesMeetingExist( countryEntity, meetingEntity ) {
        if ( meetingEntity.length === 0 ) {
            entity = controller.create(handler.data, countryEntity)
            return entity
        } else {
            return callUpdate(handler.data, meetingEntity)
        }
    }
    function getCountry( promise ) {
        return promise.then(function( countryEntity ) {
            return countryEntity
        })
    }
    function getMeetingUsingRaceEntity( raceEntity ) {
        controller.find({_id: raceEntity._meeting})
        .then(function( meetingEntity ){
            if ( meetingEntity["0"].races.length === 0 ) {
                controller.updateRaces(raceEntity, meetingEntity["0"])
            }
        })
    }
    function iteratePromises( promises ) {
        promises.forEach(function( promise ){
            promise.then(getMeetingUsingRaceEntity)
        })
    }
    function init( object ) {
        handler.data = object.data.PARaceCardObject ? object.data.PARaceCardObject : object.data.PABettingObject;
        return Promise.all([
            getCountry(object.promise),
            controller.find({ x_reference: handler.data.Meeting.ID })
        ])
        .spread(function( countryEntity, meetingEntity ) {
            return doesMeetingExist(countryEntity, meetingEntity)
        })
        .catch(errorHandler)
    }
    var handler = {
        init: init,
        data: data,
        iterateRacePromises: iterateRacePromises
    }
    return handler
}());