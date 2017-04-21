/**
 * Created by Zakaria on 20/04/2017.
 */

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

var Grid = require('gridfs-stream');
var GridFS = Grid(mongoose.connection.db, mongoose.mongo);
var mime = require('mime');


module.exports = function (app, express) {
  var apiUser = express.Router();
  /*------------------------------------------ Routes/Middleware ------------------------------------------------*/
  /*-------------------------------------- GET /api/users --------------------------------------*/
  apiUser.get('/', list);
  /*-------------------------------------- POST /api/users -------------------------------------*/
  apiUser.post('/', multipartMiddleware, create);
  /*-------------------------------------- GET /api/users/:userId -------------------------*/
  apiUser.get('/:userId', read);
  /*-------------------------------------- PUT /api/users/:userId -------------------------*/
  apiUser.put('/:userId', update);
  /*-------------------------------------------------------------------------------------------------*/
  // Finish by binding the user middleware
  apiUser.param('userId', userByID);
  /*------------------------------------------ Used functions ---------------------------------------------------*/

  function storeFiles(files, type, callback) {
    var toBeStored = [];
    var tasksQueue = async.queue(function (file, callback) {
      var extArray = file.type.split("/");
      var fileName = file.name;
      var extension = extArray[extArray.length - 1];
      var dbPath = process.hrtime() + '-' + type + '.' + extension;
      var newPath = path.resolve("./public/uploads/" + dbPath);
      async.parallel([function (gfsCallback) {
          try {
            var writestream = GridFS.createWriteStream({
              filename: dbPath,
              mode: 'w',
              chunkSize: 1024 * 4,
              // root: type + '_collection',
              content_type: mime.lookup(file.path),
              metadata: {
                uploadedBy: 'system',
                name: fileName
              }
            });
            writestream.on('close', function (file) {
              console.log('done writing binary'.yellow);
              console.log(file)
              return gfsCallback(null, {
                _id: file._id,
                contentType: file.contentType
              });
            });
            fs.createReadStream(file.path).pipe(writestream);
          } catch (err) {
            log.error(err);
            gfsCallback('failed to store file ' + err);
          }
        }, function (fsCallback) {
          fs.readFile(file.path, function (err, data) {
            fs.writeFile(newPath, data, function (err) {
              if (err) {
                fsCallback('failed to store file ' + err);
              }
              else {
                console.log('done'.yellow);
                fsCallback(null, {
                  url: dbPath,
                  caption: file.name,
                  thumbUrl: dbPath
                });
              }
            });
          });
        }],
        function (err, result) {
          if (!err) {
            callback(null, _.extend(result[0], result[1]));
          }
          else {
            console.log(err);
            callback(err);
          }
        });
    }, 10);

    _.each(files, function (file) {
      tasksQueue.push(file, function (err, result) {
        //Done
        if (err) {
          console.log(err);
          callback('error : ' + err)
        }
        toBeStored.push(result);// add the new stored path
      });
    });
    // When all is processed, drain is called
    tasksQueue.drain = function () {
      callback(null, toBeStored);
    };
  }


  /**
   * List of Users
   */
  function list(req, res) {
    User.find().sort('-created').exec(function (err, users) {
      if (err) {
        return res.status(400).send({
          message: 'error occured !'
        });
      } else {
        res.jsonp(users);
      }
    });
  };

  /**
   * Create a User
   */
  function create(req, res) {
    var files = req.files.file;
    delete req.files.file;
    var user = new User(
      {
        locality: {
          address: req.body.locality.address,
          city: req.body.locality.city,
          postal_code: req.body.locality.postal_code,
          country: req.body.locality.country
        },
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        displayName: req.body.firstName + ' ' + req.body.lastName.charAt(0) + '.',
        email: req.body.email
      }
    );

    storeFiles(files[0], 'image', function (err, result) {
      if (err) {
        res.status(500).json({message: 'failed to store files'})
      } else {
        user.picture = result[0]; // The result of stored pictures' array
        user.save(function (err) {
          if (err) {
            console.log(err)
            return res.status(400).send({
              message: "Error : User hasn't been saved"
            });
          } else {
            res.status(201).jsonp(user);
          }
        });
      }
    })

  };

  /**
   * Get one user
   */
  function read(req, res) {
    // convert mongoose document to JSON
    var user = req.user ? req.user.toJSON() : {};

    res.jsonp(user);
  };
  /**
   * Update a User
   */
  function update(req, res) {
    var user = req.user;
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: "Error : User hasn't been updated !"
        });
      } else {
        res.jsonp(user);
      }
    });
  };
  /**
   * User middleware
   */
  function userByID(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'User is invalid'
      });
    }

    User.findById(id).exec(function (err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return res.status(404).send({
          message: 'No User with that identifier has been found'
        });
      }
      req.user = user;
      next();
    });
  };
  return apiUser;
}