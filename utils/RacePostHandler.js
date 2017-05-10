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
    function init( object ) {
        handler.data = object.data.PARaceCardObject ? object.data.PARaceCardObject : object.data.PABettingObject;
         /**
         * 1) Iterate over each race
         * 2) Calling the racePostHandler passing in the race data and the meetingPromise
         * 3) We need the meeting promise to set the _meeting cross reference id in the race document
         * which will allow us to populate the meeting document with races
         * 4) We need to iterate over the Horse array whilst iterating over the race array
         */
        raceEntities = _.map(handler.data.Meeting.Race, function( race ) {
            Promise.all([getMeeting(object.promise), controller.find({x_reference: race.ID})])
            .spread(function( meetingEntity, raceEntity ) {
                return doesRaceExist(meetingEntity, raceEntity, race)
            })
            .then(function( raceEntity ) {
                // Call horse posthandler here (Why?: Well each race contains an array of horses so it makes sense to iterate over the horse array here after creating the race entities)
                // horsePostHandler( raceEntity, race.Horse ) where race.Horse is the array of horses.
                // TODO: When handling betting data we need to check whether or not the Horse array is empty, if its empty we should not call the horsePostHandler module
               x = horsePostHandler.init(raceEntity, race.Horse)
               _.each(x, function(p){
                   p.then(function(e){
                       // This should only be done if the raceEntity does nkt contain any horses
                    Race.findOneAndUpdateAsync(
                        { _id: raceEntity._id },
                        { $push: { horses: e } },
                        { new: true }
                    )
                    .then(function(r){
                        console.log(r)
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                    Race.findOne({ x_reference: "sou1705112503sco" }).populate('horses').exec(function(err, race){
                        if (err) {
                            console.log(err)
                        }
                        console.log(race)
                    })
                   })
               })
            })
            .catch(errorHandler)

            // Race.findById('59126d34be520e385459caa4')
            // .populate('horses')
            // .exec(function(err, docs){
            //     if (err) {
            //         console.log(err)
            //     }
            //     console.log(docs)
            // })

            // return race;
        })
    }
    var handler = {
        init: init,
        data: data
    }
    return handler;
}());