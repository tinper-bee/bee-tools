var karmaCommonConfig = require('./getKarmaCommonConfig');
var assign = require('object-assign');

module.exports = function(config) {
    var browsers = ['Chrome', 'Firefox', 'Safari'];
    if (process.platform === 'win32') {
        browsers.push('IE');
    }
    config.set(assign(karmaCommonConfig(), {
        browsers: browsers
    }))
};