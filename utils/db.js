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
      console.log('Connected to: ' + process.env.DB_URL)
    })
    .catch(function( error ) {
      console.log('Connection Failed: ' + error)
    })
  },
  setup: function() {
    return new Promise(function( resolve, reject ) {
      mongoose.connection.db.dropDatabase();
      countryController.create("South Africa")
      .then(function(success) {
        console.log(success.name + " entity created successfully")
        resolve()
      })
      .catch(function(error) {
        reject(error)
      })
    })
  }
}

module.exports = db;