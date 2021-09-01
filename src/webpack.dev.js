var fs = require('fs');
var webpack = require('webpack');
var path = require('path');

var node_modules_whitelist = [ // 需要webpack解析的库
    path.join(process.cwd(), './node_modules/lodash-es'),
    path.join(process.cwd(), './node_modules/@tinper/next-ui')
]

function getLoaderExclude(path) {
    if (!!path.match("@tinper/next-ui") || !!path.match(/lodash-es/)) {
        return false
    }
    var isNpmModule = !!path.match(/node_modules/);
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
                exclude: getLoaderExclude,
                include: [path.join(process.cwd(), './src'), path.join(process.cwd(), './demo'), path.join(process.cwd(), './test'), ...node_modules_whitelist],
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015-ie', 'stage-1'].map(function(item) {
                        return require.resolve('babel-preset-' + item);
                    }),
                    plugins: [
                        'transform-es3-member-expression-literals',
                        'transform-es3-property-literals',
                        'transform-object-assign',
                        'transform-object-entries',
                        'add-module-exports',
                        'transform-object-rest-spread'
                    ].map(function(item) {
                        return require.resolve('babel-plugin-' + item);
                    }),
                    cacheDirectory: true
                }
            }

        ]
    },
    resolve: {
        root: [
            path.join(process.cwd(), './node_modules')
        ],
        extensions: ['', '.js', '.jsx'],
    },
    resolveLoader: {
        root: [
            path.join(__dirname, '../node_modules')
        ]
    },
    externals: {
        react: 'var React', // 相当于把全局的React作为模块的返回 module.exports = React;
        'react-dom': 'var ReactDOM',
        'prop-types': 'PropTypes'
    },
    devtool: 'source-map',
    plugins: [
        // SourceMap plugin will define process.env.NODE_ENV as development
       // new webpack.SourceMapDevToolPlugin({
         //   columns: false
       // })
    ]
};
