var karmaCommonConfig = require('./getKarmaCommonConfig');
var assign = require('object-assign');
var webpack = require('webpack');
var util = require('./util');
var fs = require('fs');
var file = require('html-wiring');

module.exports = function(config) {
    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 7',
        },
        sl_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
        },
        sl_safari: {
            base: 'SauceLabs',
            platform: 'OS X 10.11',
            browserName: 'safari',
        },
        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11',
        },
        sl_ie_10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10',
        },
        sl_ie_9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '9',
        },
        sl_ie_8: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '8',
        },
    };

    // Use ENV vars on Travis and sauce.json locally to get credentials
    if (!process.env.SAUCE_USERNAME) {
        if (!fs.existsSync(util.getFromCwd('sauce.json'))) {
            console.log('Create a sauce.json with your credentials.');
            process.exit(1);
        } else {
            var sauceCfg = JSON.parse(file.readFileAsString('sauce.json'));
            process.env.SAUCE_USERNAME = sauceCfg.username;
            process.env.SAUCE_ACCESS_KEY = sauceCfg.accessKey;
        }
    }

    var commonConfig = karmaCommonConfig();
    commonConfig.webpack.plugins = [
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': '"production"'
        // })
    ];
    // see https://github.com/karma-runner/karma-sauce-launcher
    config.set(assign(commonConfig, {
        sauceLabs: {
            testName: 'UXCore cross-broswer util test',
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ['mocha', 'saucelabs'],
        singleRun: true,
        concurrency: 4,
    }));
}
