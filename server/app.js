var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Create the server for handling REST requests, initialize Express
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Register API routes in app, REST endpoints
var routes = require('./routes');
routes(app)

// Static path to production build of React Client
// https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  const error_msg = {
    code: err.status || 500,
    message: err.message
  };
  res.status(err.status || 500);
  res.json(error_msg);
});

module.exports = app;
