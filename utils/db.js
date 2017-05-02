var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

module.exports = {
  connect: function() {
    mongoose.connectAsync(process.env.DB_URL)
    .then(function(){
      console.log('Connected to: ' + process.env.DB_URL)
    })
    .catch(function( error ) {
      console.log('Connection Failed: ' + error)
    })
  },
  clear: function() {
    mongoose.connection.db.dropDatabase()
    console.log("Cleared Database: " + process.env.DBURL)
  }
}