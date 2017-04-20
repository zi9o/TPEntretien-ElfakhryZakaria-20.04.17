/**
 * Created by Zakaria on 02/01/2017.
 */
var config = require('./app/config/config');
var mongoose = require('mongoose');
module.exports = function (grunt) {// Do grunt-related things in here
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    distFolder: 'dist',
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    // configure nodemon
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    concat: {
      // Specify some options, usually specific to each plugin.
      options: {
        // Specifies string to be inserted between concatenated files.
        separator: ';'
      },
      // 'dist' is what is called a "target."
      // It's a way of specifying different sub-tasks or modes.
      dist: {
        // The files to concatenate:
        // Notice the wildcard, which is automatically expanded.
        src: ['scripts/*.js'],
        // The destination file:
        // Notice the angle-bracketed ERB-like templating,
        // which allows you to reference other properties.
        // This is equivalent to 'dist/main.js'.
        dest: '<%= distFolder %>/main.js'
        // You can reference any grunt config property you want.
        // Ex: '<%= concat.options.separator %>' instead of ';'
      }
    }
  });

// We've set up each task's configuration.
  // Now actually load the tasks.
  // This will do a lookup similar to node's require() function.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // load nodemon
  grunt.loadNpmTasks('grunt-nodemon');

  // Make sure upload directory exists
  grunt.task.registerTask('mkdir:upload', 'Task that makes sure upload directory exists.', function () {
    // Get the callback
    var done = this.async();
    var path = require('path');
    console.log(path.normalize(__dirname + '/public/uploads'));
    grunt.file.mkdir(path.normalize(__dirname + '/public/uploads'));


    done();
  });


  // droping database
  grunt.registerTask('drop', 'drop the database', function () {
    var done = this.async();// async mode
    mongoose.connect(config.database);
    mongoose.connection.on('open', function (err) {
      if (err) {
        console.log('not opened ' + err);
      }
      mongoose.connection.db.dropDatabase(function (err) {
        if (err) {
          console.log('errur ' + err);
        } else {
          console.log('Successfully dropped db');
        }
        mongoose.connection.close(done);
      });
    });
  });

  // A very basic default task.
  grunt.registerTask('default', ['mkdir:upload', 'nodemon',]);
};
