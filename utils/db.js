/**
 * db is a helper module that provides function to connecting to the data store server.
 */

/**
 * Dependencies
 * @mongoose, @bluebird
 */
var mongoose = require('mongoose'),
    Promise = require('bluebird');

// Promisify all mongoose method return values.
Promise.promisifyAll(mongoose);

module.exports = {
  /**
   * Connect to the data store server
   */
  connect: function() {
    mongoose.connectAsync(process.env.DB_URL)
    .then(function(connection) {
      console.log('Connected to: ' + process.env.DB_URL)
    })
    .catch(function( error ) {
      console.log('Connection Failed: ' + error)
    })
  },
  /**
   * Delete all from the data store
   */
  clear: function() {
     mongoose.connection.db.dropDatabase()
  }
}
