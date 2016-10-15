var karmaCommonConfig = require('./getKarmaCommonConfig');
var assign = require('object-assign');

module.exports = function(config) {
    config.set(assign(karmaCommonConfig(), {
        browsers: ['PhantomJS'],
        singleRun: true,
        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered
            // (useful if karma exits without killing phantom)
            exitOnResourceError: true,
        },
    }))
};