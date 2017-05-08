var controller = require('../controllers').meeting;

module.exports = (function() {
    var data;
    var countryEntity;
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
    function checkIfMeetingExists( entity ) {
        if ( entity.length === 0 ) {
            entity = controller.create(meetingPostHandler.data, meetingPostHandler.countryEntity)
            return callUpdate(meetingPostHandler.data, entity)
        } else {
            return callUpdate(meetingPostHandler.data, entity)
        }
    }
    function init( object ) {
        meetingPostHandler.data = object.data.PARaceCardObject ? object.data.PARaceCardObject : object.data.PABettingObject;
        
        // TODO: Promise all ****
        // return Promise.all([getCountry(), findMeeting()])
        // .then(function(arr){
        //     // countryEntity[0]
        //     // meetingEntity[0]
        //     // return checkIfEntityExists(meetingEntity, countryEntity)
        // })
        // .catch(errorHandler)
        
        return object.promise.then(function( countryEntity ){
             meetingPostHandler.countryEntity = countryEntity;
             return controller.find({x_reference: meetingPostHandler.data.Meeting.ID})
            .then(checkIfMeetingExists)
            .catch(errorHandler)
        })
    }
    var meetingPostHandler = {
        init: init,
        data: data,
        countryEntity: countryEntity
    }
    return meetingPostHandler
}());