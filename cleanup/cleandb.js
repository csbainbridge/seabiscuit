#!/usr/bin/env node

var mongoose = require('mongoose'),
    Promise = require('bluebird');

Promise.promisifyAll(mongoose);

// Connect to Seabiscuit database
mongoose.connectAsync('mongodb://localhost/Seabiscuit')
.then(function( success ) {
    // Drop the entire database
    mongoose.connection.db.dropDatabase();
    // Wait 5 seconds before exiting this script
    setTimeout(function() { process.exit() }, 5000)
})
.catch(function( error ) {
    console.log("Could not connect to clean database.")
})