/**
 * Betting Post Handler handles betting data from POST request to route /country?name=country_name&type=betting 
 */

/**
 * Dependencies
 * @ErrorHandler, @MeetingController, @RaceController, @HorseController, @underscore
 */
var handleError = require('../../utils/ErrorHandler').error,
    meetingController = require('../../controllers/MeetingController'),
    raceController = require('../../controllers/RaceController'),
    horseController = require('../../controllers/HorseController'),
    _ = require('underscore');

module.exports = (function() {
    // Module global
    var revisionMap = new Map();
     /**
     * Error correcting code that prevents data been saved to the database if it is received in the incorrect order.
     * Data that is received out of sync is stored in a map, this data stored until the revision before it is received.
     * 
     * @param {Object} data The PA Betting Object
     * @param {Object} race The Race Object
     * @param {Object} raceEntity The Race Entity Object
     */
    function correctBettingSequence( data, race, raceEntity ) {
        if ( revisionMap.size > 0 && revisionMap.get(data.PABettingObject.Meeting.Race.ID) !== undefined) {
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
                    return;
                }
            }
             /**
             * Checks if the PA Betting Object received is the next revision required.
             * 
             * @param {Object} data The PA Betting Object
             * @param {Map} revisions The Revisions Map
             * @param {Object} raceEntity The Race Entity Object
             * @param {Object} race  The Race Object
             */
            function checkIfNextInSequence(data, revisions, raceEntity, race ) {
                if ( parseInt(data.PABettingObject.Revision) === (raceEntity.current_revision + 1) ) {
                    checkIfPreviouslyProcessed(data, revisions, raceEntity, race)
                } else {
                    revisions.set(data.PABettingObject.Revision, data)
                    revisionMap.set(data.PABettingObject.Meeting.Race.ID, revisions)
                }
                return;
            }
            checkIfNextInSequence(data, revisionMap.get(data.PABettingObject.Meeting.Race.ID), raceEntity, race)
        } else {
            var key = data.PABettingObject.Meeting.Race.ID;
            var revisions = new Map();
            revisions.set(data.PABettingObject.Revision, data);
            revisionMap.set(key, revisions)
            if ( parseInt(data.PABettingObject.Revision) === 1 ) {
                raceController.bettingUpdate(data, race, raceEntity)
                if ( data.PABettingObject.Meeting.Race.Horse.length > 0 ) {
                    iterateHorsesSynchronously(data, data.PABettingObject.Meeting.Race.Horse, raceEntity)
                }
            }
            return;
        }
    }
     /**
     * Calls the bettingUpdate method of the Meeting Controller.
     * 
     * @param {Object} race The Race Object
     * @param {Object} meetingEntity The Meeting Entity Object
     */
    function callMeetingUpdate( race, meetingEntity ) {
        return meetingController.bettingUpdate(race, meetingEntity["0"])
    }
     /**
     * Calls the correctBettingSequence function of this module.
     * 
     * @param {Object} data The PA Betting Object
     * @param {Object} race The Race Object
     * @param {Object} raceEntity The Race Entity Object
     */
    function callRaceUpdate( data, race, raceEntity ) {
        return correctBettingSequence( data, race, raceEntity["0"] )
    }
     /**
     * Synchronous function that recursively processes each horse object in the Horse Array.
     * 
     * @param {Object} data The PA Betting Object
     * @param {Array} horseArray The Horse Array
     * @param {Object} raceEntity The Race Entity Object
     */
    function iterateHorsesSynchronously( data, horseArray, raceEntity ) {
        var horse = horseArray.pop();
        horseController.find({name: horse.Name, _raceref: raceEntity._id}).then(function( horseEntity ) {
            horseController.bettingUpdate(data, horse, horseEntity["0"])
        })
        if ( horseArray.length ) {
            iterateHorsesSynchronously(data, horseArray, raceEntity)
        }
    }
     /**
     * Entry function for processing of the Race Object. Finds the race received in the PA Betting Object in the database.
     * 
     * @param {Object} race The Race Object
     * @param {Object} data The PA Betting Object
     */
    function iterateRaces( race, data ) {
        return raceController.find({x_reference: race.ID}).then(callRaceUpdate.bind(null, data, race)).catch(handleError)
    }
    /**
     * Root function that processes meeting data, and checks if the PA Betting Object contains a Race Object
     * 
     * @param {Object} data The PA Betting Object
     */
    function init( countryName, data ) {
        return meetingController.find({x_reference: data.PABettingObject.Meeting.ID})
        .then(callMeetingUpdate.bind(null, data))
        .then(function( success ) {
            if ( data.PABettingObject.Meeting.Race.ID !== "" ) {
                iterateRaces(data.PABettingObject.Meeting.Race, data)   
            }
            return;
        })
    }
    /**
    * Object to return when the module function is called.
    */
    var bettingPostHandler = {
        init: init
    }
    return bettingPostHandler;
}());