
// dependency
var fs = require('fs');
var inquirer = require('inquirer');
var spawn = require('cross-spawn');
var file = require('html-wiring');
var colors = require('colors/safe');
var util = require('./util');
var path = require('path');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var shelljs = require('shelljs');

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
var webpackCfg = require('./webpack.dev.js');


colors.setTheme({
    info: ['bold', 'green']
});


gulp.task('pack_demo', function(cb) {
    webpack(require('./webpack.dev.js'), function (err, stats) {
        // 重要 打包过程中的语法错误反映在stats中
        console.log('webpack log:' + stats);
        if(err) cb(err);
        console.info('###### pack_demo done ######');
        cb();
    });
});

gulp.task('pack_build', ['clean_build'], function(cb) {
    console.log(colors.info('###### pack_build start ######'));
    var pkg = util.getPkg();
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

gulp.task('sass_component', function () {
    gulp.src([path.join(process.cwd(), './src/**/*.scss')])
        .pipe(sass())
        .pipe(gulp.dest('./build'));
        console.log('###### sass_component done ######');
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

gulp.task('clean_build', function () {
    return shelljs.rm('-rf', util.getFromCwd('build'));
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
    reload();
});


gulp.task('reload_by_demo_css', ['sass_demo'], function () {
    reload();
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
    'pack_demo',
    'sass_demo'
], function() {
  var port = util.getPkg().config.port || 3000;
    browserSync({
        server: {
            baseDir: path.join(process.cwd(), './'),
            port: port
        },
        open: 'external'
    });

    gulp.watch([path.join(process.cwd(), './src/**/*.js'), path.join(process.cwd(),'./demo/**/*.js')], ['reload_by_js']);

    gulp.watch(path.join(process.cwd(),'src/**/*.scss'), ['reload_by_demo_css']);

    gulp.watch(path.join(process.cwd(),'demo/**/*.scss'), ['reload_by_demo_css']);

});


gulp.task('build', ['pack_build', 'sass_component'], function() {});

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
