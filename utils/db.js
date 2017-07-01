/**
 * db is a helper module that provides function to connecting to the data store server.
 */

/**
 * Dependencies
 * @mongoose, @bluebird
 */
var mongoose = require('mongoose'),
    Promise = require('bluebird'),
    countryController = require('../controllers/CountryController');

// Promisify all mongoose method return values.
Promise.promisifyAll(mongoose);

var db = {
  /**
   * Connect to the data store server, and reset its contents 
   */
  connect: function() {
    mongoose.connectAsync(process.env.DB_URL)
    .then(db.setup)
    .then(function() {
      console.log(new Date() + ' Connected to: ' + process.env.DB_URL)
    })
    .catch(function( error ) {
      console.log(new Date() + ' Connection Failed: ' + error)
    })
  },
  /**
   * Setup static database entities
   * Purpose: Countries could not be dynamically created due to async processing of race card data,
   * therefore they are created in the setup method of the db module
   */
  setup: function() {
    return new Promise(function( resolve, reject ) {
      mongoose.connection.db.dropDatabase();
      countryController.create("South Africa")
      .then(function( success ) {
        console.log(new Date() + ' ' + ": Database entities created successfully")
        resolve()
      })
      .catch(function(error) {
        reject(error)
        return
      })
    })
  }
}

module.exports = db;