'use strict';

var getFromCwd = require('./util').getFromCwd;
var getKarmaCommonConfig = require('./getKarmaCommonConfig');
var assign = require('object-assign');

module.exports = function conf(config) {
  var commonConfig = getKarmaCommonConfig();
  var preprocessors = {};
  preprocessors[commonConfig.files[commonConfig.files.length - 1]] = 'webpack'; // remove sourcemap
  var reporters = ['progress', 'coverage'];
  var coverageReporter = {
    reporters: [
      {
        type: 'lcov',
        subdir: '.',
      },
      {
        type: 'text',
      },
    ],
    dir: getFromCwd('coverage/'),
  };
  if (process.env.TRAVIS_JOB_ID) {
    reporters = ['coverage', 'coveralls'];
  }
  commonConfig.webpack.module.postLoaders = [
    {
      test: /\.jsx?$/,
      include: /src\//,
      loader: 'istanbul-instrumenter',
    },
  ];
  config.set(assign(commonConfig, {
    preprocessors,
    webpack: commonConfig.webpack,
    reporters,
    coverageReporter,
    browsers: ['PhantomJS'],
    singleRun: true,
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered
      // (useful if karma exits without killing phantom)
      exitOnResourceError: true,
    },
  }));
};