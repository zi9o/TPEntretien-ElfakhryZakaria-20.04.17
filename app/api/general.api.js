/**
 * Created by Zakaria on 20/04/2017.
 */
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var gridFS = Grid(mongoose.connection.db, mongoose.mongo);


module.exports = function (app, express) {

  var apiGeneral = express.Router();

  /*------------------------------------------ Routes/Middleware ------------------------------------------------*/
  /*-------------------------------------- GET /api/uploads/:fileName --------------------------------------*/
  apiGeneral.get('/uploads/:fileName', readFile);


  // Finish by binding the Besoin middleware
  apiGeneral.param('fileName', fileByFilename);


  /*------------------------------------------ Used functions ---------------------------------------------------*/
  function readFile(req, res) {
    // root: type + '_collection',
    gridFS.files.find({filename: req.fileName}).toArray(function (err, files) {

      if (files.length === 0) {
        return res.status(400).send({
          message: 'File not found'
        });
      }

      res.writeHead(200, {'Content-Type': files[0].contentType});

      var readstream = gridFS.createReadStream({
        filename: files[0].filename
      });

      readstream.on('data', function (data) {
        res.write(data);
      });

      readstream.on('end', function () {
        res.end();
      });

      readstream.on('error', function (err) {
        console.log('An error occurred!', err);
        throw err;
      });
    });
  }


  /**
   * Files middleware for extracting fileName
   */
  function fileByFilename(req, res, next, fileName) {
    req.fileName = fileName;
    next();
  }

  return apiGeneral;
};