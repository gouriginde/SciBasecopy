var express = require('express');
var socket_io = require("socket.io");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
try {
  mongoose.connect('mongodb://localhost/scibase');
} catch (err) {
  throw new Error("Could not connect to database");
}

// add aminer schema
require('./models/AminerSchema');


var app = express();
var io = socket_io(); // Socket.io
app.io = io;

var routes = require('./routes/index')(io);
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/downloads',express.static(path.join(__dirname, 'files/datasets')));

app.use('/', routes);
app.use('/users', users);

// api - amier
app.use('/api/aminer', require('./routes/api/aminer'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
