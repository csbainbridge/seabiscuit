var controller = require('../controllers').horse;
var Promise = require('bluebird');
var _ = require('underscore');

module.exports = (function() {
    function errorHandler( error ) {
        return { message: "fail", data: error }
    }
    function callUpdate( horse, horseEntity ) {
        if ( Array.isArray(horseEntity) ) {
            return controller.update(horse, horseEntity["0"])
        }
    }
    function doesHorseExist( raceEntity, horseEntity, horse ) {
        if ( horseEntity.length === 0 ) {
            entity = controller.create(horse, raceEntity)
        } else {
            return callUpdate(horse, horseEntity)
        }
    }
    function init( raceEntity, horseArray ) {
        x = _.map(horseArray, function( horse ) {
            return controller.find({name: horse.Name})
            .then(function(horseEntity){
                return doesHorseExist(raceEntity, horseEntity, horse)
            })
        })
        return x
    }
    var handler = {
        init: init
    }
    return handler
}());