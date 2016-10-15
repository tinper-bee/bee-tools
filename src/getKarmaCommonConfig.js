'use strict';

var getFromCwd = require('./util').getFromCwd;
var assign = require('object-assign');
var webpackCfg = require('./webpack.dev.js');

module.exports = function () {
  var indexSpec = getFromCwd('tests/index.js');
  var files = [
    require.resolve('console-polyfill/index.js'),
    require.resolve('es5-shim/es5-shim.js'),
    require.resolve('es5-shim/es5-sham.js'),
    indexSpec,
  ];
  // webpackCfg.entry = [];
  var preprocessors = {};
  preprocessors[indexSpec] = ['webpack', 'sourcemap'];
  return {
    reporters: ['mocha'],
    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd',
      },
    },
    frameworks: ['mocha'],
    files: files,
    preprocessors: preprocessors,
    webpack: assign(webpackCfg, {
      externals: {},
    }),
    webpackServer: {
      noInfo: true, //please don't spam the console when running in karma!
    },
  };
};
