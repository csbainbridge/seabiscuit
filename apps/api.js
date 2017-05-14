var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var racedayRouter = require('../routes/ApiServerRoutes');
var app = express();

require('dotenv').config()

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * TODO: Have a look at helmet for api security
 */

/**
 * TODO: API Authentication Key generation 
 * (Use a method where you can create API keys by which clients can use to get data from the Race Day API)
 */

/**
 * Middleware sets permissive CORS header on each request. Allows server to only be used as API server.
 * Disables caching, latest betting data is always received.
 */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Request-With');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
  res.header('Cache-Control', 'no-cache');
  next();
})

/**
 * Uses racedayApiRouter middleware
 *
*/
app.use('/', racedayRouter)

/**
 * Catches and forwards 404 error to error handler.
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handler that displays caught error message if in the development environment.
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
