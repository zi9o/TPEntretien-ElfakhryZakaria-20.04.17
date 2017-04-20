/**
 * Created by Zakaria on 20/04/2017.
 */

var jwt = require('jwt-simple');
var qs = require('querystring');
var async = require('async');
var request = require('request');
var moment = require('moment');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path'),
  fs = require('fs'),
  _ = require('lodash');
var colors = require('colors');
var mongoose = require('mongoose');
var User = require('../models/user.model');
var config = require('../config/config');