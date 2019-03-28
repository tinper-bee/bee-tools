// dependency
// var fs = require("fs");
// var inquirer = require("inquirer");
// var spawn = require("cross-spawn");
// var file = require("html-wiring");
// var colors = require("colors/safe");
// var util = require("./util");
// var path = require("path");

// var browserSync = require("browser-sync");
// var reload = browserSync.reload;
// var shelljs = require("shelljs");

// gulp & gulp plugin
// var gulp = require("gulp");
// var babel = require("gulp-babel");
// var sass = require("gulp-sass");
// var sourcemaps = require("gulp-sourcemaps");
// var autoprefix = require("gulp-autoprefixer");
// var concat = require("gulp-concat");
// var replace = require("gulp-just-replace");
// var es3ify = require("gulp-es3ify");
// var eslint = require("gulp-eslint");
// var conven = require("gulp-conventional-changelog");
// var fse = require("fs-extra");

var download = require('download-git-repo');
// const chalk = require('chalk');

// webpack
// var webpack = require("webpack");


// gulp.task("download", function() {
//   console.log(" ----download------- ");
//   // console.log(chalk.cyan(`Downloading \'ac\' please wait.`));
//   // download('direct:https://github.com/iuap-design/tinper-bee.git', 'test/tmp', function (err) {
//   //   if (!err) {
//   //       console.log(err ? 'Error' : 'Success')
//   //     } else {
//   //       console.error(requestBody.message);
//   //   }
//   // })
// });

// function download(){
//   console.log(" ----download------- ");
//   download('direct:https://github.com/iuap-design/tinper-bee.git', 'test/tmp', function (err) {
//     if (!err) {
//         console.log(err ? 'Error' : 'Success')
//       } else {
//         console.error(requestBody.message);
//     }
//   });
// }

function writeThemColor(){
  
}

module.exports = function (name, options) {
  console.log(" p--- ",name);
  console.log(" options--- ",options);
}


// module.exports = {
//   download:download()
// }