var karmaCommonConfig = require('./getKarmaCommonConfig');
var assign = require('object-assign');
var webpack = require('webpack');
var happypack = require('happypack');

module.exports = function(config) {
    var browsers = ['Chrome'];
    var commonConfig = karmaCommonConfig();
    commonConfig.webpack.plugins = [
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': '"production"'
        // }),
        new webpack.SourceMapDevToolPlugin({
            columns: false
        }),
        new happypack({
            id: 'js'
        }),
    ];
    config.set(assign(commonConfig, {
        browsers: browsers
    }))
};