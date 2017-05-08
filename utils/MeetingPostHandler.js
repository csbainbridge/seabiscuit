var controller = require('../controllers').meeting;
var Promise = require('bluebird');

module.exports = (function() {
    var data;
    function errorHandler( error ) {
        return { message: "fail", data: error }
    }
    function callUpdate( data, meetingEntity ) {
        if ( Array.isArray(meetingEntity) ) {
            return controller.update(data, meetingEntity["0"])
        } else {
            return meetingEntity.then(function( meetingEntity ){
                return controller.update(data, meetingEntity)
            })
        }
    }
    function doesMeetingExist( countryEntity, meetingEntity ) {
        if ( meetingEntity.length === 0 ) {
            entity = controller.create(handler.data, countryEntity)
            return callUpdate(handler.data, entity)
        } else {
            return callUpdate(handler.data, entity)
        }
    }
    function getCountry( promise ) {
        return promise.then(function(countryEntity){
            return countryEntity
        })
    }
    function init( object ) {
        handler.data = object.data.PARaceCardObject ? object.data.PARaceCardObject : object.data.PABettingObject;
        return Promise.all([getCountry(object.promise), controller.find({x_reference: handler.data.Meeting.ID})])
        .spread(function( countryEntity, meetingEntity ) {
            return doesMeetingExist(countryEntity, meetingEntity)
        })
        .catch(errorHandler)
    }
    var handler = {
        init: init,
        data: data
    }
    return handler
}());