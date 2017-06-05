var handleError = require('../../utils/ErrorHandler').error,
    meetingController = require('../../controllers/MeetingController'),
    raceController = require('../../controllers/RaceController'),
    horseController = require('../../controllers/HorseController'),
    _ = require('underscore');

module.exports = (function() {
    function callMeetingUpdate( race, meetingEntity ) {
        meetingController.bettingUpdate(race, meetingEntity["0"])
    }
    function callRaceUpdate( data, race, raceEntity ) {
        raceController.correctSequence( data, race, raceEntity["0"] )
        if ( race.Horse.length > 0 ) {
            iterateHorses(data, race.Horse, raceEntity)
        }
    }
    function iterateHorses( data, horseArray, raceEntity ) {
        _.each(horseArray, function( horse ) {
            horseController.find({name: horse.Name, _raceref: raceEntity["0"]._id}).then(function( horseEntity ) {
                horseController.bettingUpdate(data, horse, horseEntity["0"])
            })
        })
    }
    function iterateRaces( race, data ) {
        raceController.find({x_reference: race.ID}).then(callRaceUpdate.bind(null, data, race)).catch(handleError)
    }
    function init( countryName, data ) {
        meetingController.find({x_reference: data.PABettingObject.Meeting.ID}).then(callMeetingUpdate.bind(null, data))
        if ( data.PABettingObject.Meeting.Race.ID !== "" ) {
            iterateRaces(data.PABettingObject.Meeting.Race, data)   
        }
    }
    var bettingPostHandler = {
        init: init
    }
    return bettingPostHandler;
}());