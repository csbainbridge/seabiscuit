var handleError = require('../../utils/ErrorHandler').error,
    meetingController = require('../../controllers/MeetingController'),
    raceController = require('../../controllers/RaceController'),
    horseController = require('../../controllers/HorseController'),
    _ = require('underscore');

module.exports = (function() {
    var revisionMap = new Map();
    function correctBettingSequence( data, race, raceEntity ) {
        if ( revisionMap.size > 0 ) {
            function checkIfPreviouslyProcessed(data, revisions, raceEntity, race) {
                var nextRevision = parseInt(data.PABettingObject.Revision) + 1
                if ( revisions.get(nextRevision.toString()) ) {
                    raceController.bettingUpdate(data, data.PABettingObject.Meeting.Race, raceEntity)
                    if ( data.PABettingObject.Meeting.Race.Horse.length > 0 ) {
                        iterateHorsesSynchronously(data, data.PABettingObject.Meeting.Race.Horse, raceEntity)
                    }
                    revisions.delete(data.PABettingObject.Revision)
                    checkIfPreviouslyProcessed(revisions.get(nextRevision.toString()), revisions, raceEntity, race)
                } else {
                    raceController.bettingUpdate(data, data.PABettingObject.Meeting.Race, raceEntity)
                    if ( data.PABettingObject.Meeting.Race.Horse.length > 0 ) {
                        iterateHorsesSynchronously(data, data.PABettingObject.Meeting.Race.Horse, raceEntity)
                    }
                    var deleteRevision = parseInt(data.PABettingObject.Revision) - 1
                    revisions.delete(deleteRevision.toString())
                    revisions.set(data.PABettingObject.Revision, data)
                    revisionMap.set(data.PABettingObject.Meeting.Race.ID, revisions)
                }
            }
            function checkIfNextInSequence(data, revisions, raceEntity, race ) {
                if ( parseInt(data.PABettingObject.Revision) === (raceEntity.current_revision + 1) ) {
                    checkIfPreviouslyProcessed(data, revisions, raceEntity, race)
                } else {
                    revisions.set(data.PABettingObject.Revision, data)
                    revisionMap.set(data.PABettingObject.Meeting.Race.ID, revisions)
                }
            }
            checkIfNextInSequence(data, revisionMap.get(data.PABettingObject.Meeting.Race.ID), raceEntity, race)
        } else {
            var key = data.PABettingObject.Meeting.Race.ID;
            var revisions = new Map();
            revisions.set(data.PABettingObject.Revision, data);
            revisionMap.set(key, revisions)
            raceController.bettingUpdate(data, race, raceEntity)
            if ( data.PABettingObject.Meeting.Race.Horse.length > 0 ) {
                iterateHorsesSynchronously(data, data.PABettingObject.Meeting.Race.Horse, raceEntity)
            }
        }
    }
    function callMeetingUpdate( race, meetingEntity ) {
        meetingController.bettingUpdate(race, meetingEntity["0"])
    }
    function callRaceUpdate( data, race, raceEntity ) {
        correctBettingSequence( data, race, raceEntity["0"] )
        //TODO: Horse data is still saved Synchronously, therefore it may be wise to move the correct sequence
        // function into this module, then within the correctSequence function afrter controller.bettingUpdate
        // if ( race.Horse.length > 0 ) {
        //     iterateHorses(data, race.Horse, raceEntity)
        // }
    }
    function iterateHorsesSynchronously( data, horseArray, raceEntity ) {
        //TODO: Maybe try create a Sync function here instead of using async each
        var horse = horseArray.pop();
        horseController.find({name: horse.Name, _raceref: raceEntity._id}).then(function( horseEntity ) {
            horseController.bettingUpdate(data, horse, horseEntity["0"])
        })
        if ( horseArray.length ) {
            iterateHorsesSynchronously(data, horseArray, raceEntity)
        }
        // _.each(horseArray, function( horse ) {
        //     horseController.find({name: horse.Name, _raceref: raceEntity["0"]._id}).then(function( horseEntity ) {
        //         horseController.bettingUpdate(data, horse, horseEntity["0"])
        //     })
        // })
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