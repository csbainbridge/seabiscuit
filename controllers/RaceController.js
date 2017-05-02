var Race = require('../models/Race');
var Promise = require('bluebird');
Promise.promisifyAll(Race)

module.exports = {
    create: function() {

    },
    find: function(params) {
        return new Promise(function( resolve, reject ) {
            Race.findAsync(params)
            .then(function( races ) {
                resolve(races)
            })
            .catch(function( error ) {
                reject(error)
                return
            }) 
        })
    },
    findById: function( id ) {
        return new Promise(function( resolve, reject ) {
            Race.findByIdAsync(id)
            .then(function( race ) {
                resolve(race)
            })
            .catch(function( error ) {
                reject( error )
                return
            })
        })
    },
    update: function() {

    },
    delete: function() {

    }
}