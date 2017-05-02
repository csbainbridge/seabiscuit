var Horse = require('../models/Horse');
var Promise = require('bluebird')
Promise.promisifyAll(Horse)

module.exports = {
    create: function() {

    },
    find: function( params ) {
        return new Promise(function( resolve, reject ) {
            Horse.findAsync(params)
            .then(function( horses ) {
                resolve(horses)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
    findById: function( id ) {
        return new Promise(function( resolve, reject ) {
            Horse.findByIdAsync(id)
            .then(function( horse ) {
                resolve(horse)
            })
            .catch(function( error ) {
                reject(error)
                return
            })
        })
    },
    update: function() {

    },
    delete: function() {

    }
}