
// dependency
var fs = require('fs');
var inquirer = require('inquirer');
var spawn = require('cross-spawn');
var file = require('html-wiring');
var colors = require('colors/safe');
var util = require('./util');
var path = require('path');
var express = require('express');
var livereload = require('connect-livereload');
var lr = require('tiny-lr');
var lrServer = lr();
var serveStatic = require('./serveStatic');
var shelljs = require('shelljs');
var ip = require('ip');
var portscanner = require('portscanner');
var open = require('open');

// gulp & gulp plugin
var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var replace = require('gulp-just-replace');
var es3ify = require("gulp-es3ify");
var eslint = require('gulp-eslint');

// webpack
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackCfg = require('./webpack.dev.js');
var MemoryFS = require("memory-fs");

var url = "";

colors.setTheme({
    info: ['bold', 'green']
});



gulp.task('pack_build', function(cb) {
    console.log(colors.info('###### pack_build start ######'))
    gulp.src([path.join(process.cwd(), './src/**/*.js'), path.join(process.cwd(), './src/**/*.jsx')])
        .pipe(babel({
            presets: ['react', 'es2015-ie', 'stage-1'].map(function(item) {
                return require.resolve('babel-preset-' + item);
            }),
            plugins: ['add-module-exports'].map(function(item) {
                return require.resolve('babel-plugin-' + item);
            })
        }))
        .pipe(es3ify())
        .pipe(gulp.dest('build'))
        .on('end', function() {
            console.log(colors.info('###### pack_build done ######'))
            cb();
        });
});

gulp.task('sass_demo', function(cb) {
    gulp.src([path.join(process.cwd(), './demo/**/*.scss')])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('demo.css'))
        .pipe(autoprefix({
            browsers: ['last 2 versions', 'not ie < 8'],
            cascade: false
        }))
        .pipe(replace([{
            search: /\/\*#\ssourceMappingURL=([^\*\/]+)\.map\s\*\//g,
            replacement: '/* end for `$1` */\n'
        }]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'))
        .on('end', function() {
            console.info(colors.info('###### sass_demo done ######'));
            cb();
        });
});

gulp.task('lint', function(cb) {
    var eslintCfg = util.getEslintCfg();
    gulp.src([
            path.join(process.cwd(), './src/**/*.js'),
            path.join(process.cwd(), './demo/**/*.js')
        ])
        .pipe(eslint(eslintCfg))
        .pipe(eslint.format('table'))
        .pipe(eslint.failAfterError());
});

gulp.task('reload_by_js', ['pack_demo'], function () {
    lrServer.changed({body: {files: ['.']}});
});

gulp.task('reload_by_component_css', ['less_component'], function () {
    lrServer.changed({body: {files: ['.']}});
});

gulp.task('reload_by_demo_css', ['less_demo'], function () {
    lrServer.changed({body: {files: ['.']}});
});

gulp.task('test', function(done) {
    var karmaBin = require.resolve('karma/bin/karma');
    var karmaConfig = path.join(__dirname, './karma.phantomjs.conf.js');
    var args = [karmaBin, 'start', karmaConfig];
    util.runCmd('node', args, done);
});

gulp.task('coverage', (done) => {
    if (fs.existsSync(util.getFromCwd('coverage'))) {
        shelljs.rm('-rf', util.getFromCwd('coverage'));
    }
    var karmaBin = require.resolve('karma/bin/karma');
    var karmaConfig = path.join(__dirname, './karma.phantomjs.coverage.conf.js');
    var args = [karmaBin, 'start', karmaConfig];
    util.runCmd('node', args, done);
});

// run your unit tests across many browsers and platforms on Sauce Labs
gulp.task('saucelabs', (done) => {
    var karmaBin = require.resolve('karma/bin/karma');
    var karmaConfig = path.join(__dirname, './karma.saucelabs.conf.js');
    var args = [karmaBin, 'start', karmaConfig];
    util.runCmd('node', args, done);
});

gulp.task('browsers', (done) => {
    var karmaBin = require.resolve('karma/bin/karma');
    var karmaConfig = path.join(__dirname, './karma.browsers.conf.js');
    var args = [karmaBin, 'start', karmaConfig];
    util.runCmd('node', args, done);
});

gulp.task('chrome', (done) => {
    var karmaBin = require.resolve('karma/bin/karma');
    var karmaConfig = path.join(__dirname, './karma.chrome.conf.js');
    var args = [karmaBin, 'start', karmaConfig];
    util.runCmd('node', args, done);
});

gulp.task('server', [
    'sass_demo'
], function() {

    var compiler = webpack(webpackCfg);

    var webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
        publicPath: '/dist',
        aggregateTimeout: 300, // wait so long for more changes
        poll: true, // use polling instead of native watchers
        stats: {
            chunks: false
        }
    });
    var app = express();
    app.use(function(req, res, next) {
        // 支持 CORS 跨域
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });
    app.use(webpackDevMiddlewareInstance);

    app.use(livereload({
        port: 35729
    }));
    app.use(serveStatic('.'));

    compiler.plugin('done', function(stats) {
        console.log(colors.info('###### pack_demo done ######'));
        lrServer.changed({body: {files: ['.']}});
    })

    webpackDevMiddlewareInstance.waitUntilValid(function(){
      console.log(colors.info('Package is in a valid state'));
      open(url)
    });

    // 开启 livereload

    lrServer.listen(35729, function() {
        console.log(colors.info('livereload server start: listening on 35729'));
    });

    // 开启调试服务
    portscanner.findAPortNotInUse(3000, 3010, ip.address(), function(error, port) {
        url = "http://" + ip.address() + ":" + port;
        var server = app.listen(port, function(err) {
            console.log(colors.info("dev server start: listening at " + url));
            if (err) {
                console.error(err);
            }
        });
        ;
    })

    gulp.watch(path.join(process.cwd(), './src/**/*.less'), ['reload_by_demo_css']);

    gulp.watch(path.join(process.cwd(), './demo/**/*.less'), ['reload_by_demo_css']);

});

gulp.task('build', ['pack_build'], function() {});

gulp.task('start', ['server']);

gulp.task('dep', function() {
    var commands = util.getPackages();
    commands.forEach(function(item) {
        util.runCmd('npm', ['i', '-d', item]);
    });
});

gulp.task('update', function() {
    var commands = util.getPackages();
    commands.forEach(function(item) {
        util.runCmd('npm', ['update', '-d', item]);
    });
});

gulp.task('tnpm-dep', function() {
    var commands = util.getPackages();
    commands.forEach(function(item) {
        util.runCmd('tnpm', ['i', '-d', item]);
    });
});

gulp.task('tnpm-update', function() {
    var commands = util.getPackages();
    commands.forEach(function(item) {
        util.runCmd('tnpm', ['update', '-d', item]);
    });
});

gulp.task('pub', ['pack_build'], function() {
    util.getQuestions().then(function(questions) {
        inquirer.prompt(questions).then(function(answers) {
            var pkg = util.getPkg();
            pkg.version = answers.version;
            file.writeFileFromString(JSON.stringify(pkg, null, ' '), 'package.json');
            console.log(colors.info('#### Git Info ####'));
            spawn.sync('git', ['add', '.'], {stdio: 'inherit'});
            spawn.sync('git', ['commit', '-m', 'ver. ' + pkg.version], {stdio: 'inherit'});
            spawn.sync('git', ['push', 'origin', answers.branch], {stdio: 'inherit'});
            console.log(colors.info('#### Npm Info ####'));
            spawn.sync(answers.npm, ['publish'], {stdio: 'inherit'});
        });
    });
});
