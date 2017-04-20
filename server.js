var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var config = require('./app/config/config');
var mongoose = require('mongoose');
var colors = require('colors');
var cors = require('cors');

var pathfinderUI = require('pathfinder-ui');// module for displaying routes
mongoose.connection.close();
mongoose.Promise = global.Promise;

// Connect to database
mongoose.connect(config.database, function (err) {
  if (err) {
    console.log('Error connecting to database')
  } else {
    console.log('Connected to database')
  }
});


app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))

app.use(express.static(__dirname + '/public'))

var apiGeneral = require('./app/api/general.api')(app, express);
var apiUsers = require('./app/api/users.api')(app, express);
app.use('/api', apiGeneral);
app.use('/api', apiUsers);

// this below allows to show the RESTful API requests' tree by typing localhost:port/pathfinder
app.use('/pathfinder', function (req, res, next) {
  pathfinderUI(app);
  next()
}, pathfinderUI.router);

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/public/app/views/index.html')
});

// port listen 3000
app.listen(config.port, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('listen on Port : ', config.port)
  }
});
