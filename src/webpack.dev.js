var fs = require('fs');
var webpack = require('webpack');
var path = require('path');
var happypack = require('happypack');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

function getLoaderExclude(path) {
    var isNpmModule = !!path.match(/node_modules/);
    console.log(isNpmModule);
    return isNpmModule;
}

module.exports = {
    cache: true,
    entry: {
        demo: './demo/index'
    },
    output: {
        path: path.join(process.cwd(), './dist'),
        filename: "[name].js",
        sourceMapFilename: "[name].js.map"
    },
    module: {
        loaders: [
            {

                test: /\.js(x)*$/,
                // npm modules 都不需要经过babel解析
                // exclude: getLoaderExclude,
                include: [path.join(process.cwd(), './src'), path.join(process.cwd(), './demo'), path.join(process.cwd(), './test')],
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015-ie', 'stage-1'].map(function(item) {
                        return require.resolve('babel-preset-' + item);
                    }),
                    plugins: [
                        'transform-es3-member-expression-literals',
                        'transform-es3-property-literals',
                        'add-module-exports'
                    ].map(function(item) {
                        return require.resolve('babel-plugin-' + item);
                    }),
                    cacheDirectory: true
                },
                happy: {id: 'js'}
            },
            {
                test: /\.svg$/,
                loader: 'babel',
                include: [path.join(process.cwd(), './src')],
                query: {
                    presets: ['react', 'es2015-ie'].map(function(item) {
                        return require.resolve('babel-preset-' + item);
                    }),
                    cacheDirectory: true
                }
            }, 
            {
                test: /\.svg$/,
                loader: 'svg2react',
                include: [path.join(process.cwd(), './src')]
            }
        ],
        postLoaders: [
            {
                test: /\.js(x)*$/,
                loader: 'es3ify',
            }
        ],
    },
    resolve: {
        root: [
            path.join(process.cwd(), './node_modules')
        ],
        extensions: ['', '.web.ts', '.web.tsx', '.web.js', '.web.jsx', '.ts', '.tsx', '.js', '.jsx'],
    },
    resolveLoader: {
        root: [
            path.join(__dirname, '../node_modules')
        ]
    },
    externals: {
        react: 'var React', // 相当于把全局的React作为模块的返回 module.exports = React;
        'react-dom': 'var ReactDOM'
    },
    plugins: [
        // SourceMap plugin will define process.env.NODE_ENV as development
        new webpack.SourceMapDevToolPlugin({
            columns: false
        }),
        new happypack({
            id: 'js'
        }),
        // new ProgressBarPlugin()
    ]
};