// dependency
var fs = require("fs");
var inquirer = require("inquirer");
var spawn = require("cross-spawn");
var file = require("html-wiring");
var colors = require("colors/safe");
var util = require("./util");
var path = require("path");
var global = require("./global");

var browserSync = require("browser-sync");
var reload = browserSync.reload;
var shelljs = require("shelljs");
var svgSymbols = require('gulp-svg-symbols');
var rename = require("gulp-rename");
// gulp & gulp plugin
var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
// var csso = require('gulp-csso');
var sourcemaps = require("gulp-sourcemaps");
var autoprefix = require("gulp-autoprefixer");
var concat = require("gulp-concat");
var replace = require("gulp-just-replace");
var es3ify = require("gulp-es3ify");
var eslint = require("gulp-eslint");
var conven = require("gulp-conventional-changelog");
var fse = require("fs-extra");

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

// webpack
var webpack = require("webpack");

colors.setTheme({
  info: ["bold", "green"]
});

gulp.task("changelogInit", function () {
  //设置镜像
  spawn.sync(
    "npm",
    ["--registry", "https://registry.npm.taobao.org", "install", "express"], {
      stdio: "inherit"
    }
  );
  //init commitizen
  spawn.sync(
    "commitizen",
    ["init", "cz-conventional-changelog", "--save", "--save-exact", "--force"], {
      stdio: "inherit"
    }
  );
});

gulp.task("changelog", function () {
  console.log(colors.info("###### build changelog ######"));
  if (!fs.accessSync("CHANGELOG.md")) {
    fse.outputFileSync(path.join(process.cwd(), "./CHANGELOG.md"), "");
  }
  gulp
    .src(path.join(process.cwd(), "./CHANGELOG.md"))
    .pipe(
      conven({
        preset: "angular",
        releaseCount: 0,
        samefile: true
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("pack_demo", function (cb) {
  var p = path.join(process.cwd(), "./demo/demolist");

  function explorer(paths) {
    var arr = [],
      scss_arr = [],
      code = [];
    fs.readdir(paths, function (err, files) {
      if (err) {
        console.log("error:\n" + err);
        return;
      }

      function sortNumber(a, b) {
        return a.replace(/[^0-9]/ig, "") - b.replace(/[^0-9]/ig, "")
      }


      files = files.sort(sortNumber);

      files.forEach(function (file) {
        if (file.search(/Demo\d+.js/) !== -1) {
          var fileName = file.replace(".js", "");

          fs.stat(paths + "//" + file, function (err, stat) {
            //console.log(stat);
            if (err) {
              console.log(err);
              return;
            }
            if (stat.isDirectory()) {
              //console.log(paths + "\/" + file + "\/");
              explorer(path + "/" + file);
            } else {
              // console.log(paths + "\/" + file);
            }
          });
          var data = fs.readFileSync(paths + "//" + file, "utf-8");
          var title, desc;
          try {
            title = data.match(/@title.{0,30}/) || [];
            title = title.join("").replace(/@title/, "");
          } catch (e) {
            console.log("please write title like @title");
          }

          try {
            desc = data.match(/@description.{0,150}/) || [];
            desc = desc.join("").replace(/@description/, "");
          } catch (e) {
            console.log("please write description like @description");
          }

          try {
            // data = data.replace(/export(\s+)(.*)/gi, "");
            var package = fs.readFileSync(
              path.join(process.cwd(), "./package.json"),
              "utf-8"
            );
            var name = JSON.parse(package).name;


            // //替换
            // var react_reg = /import[a-zA-Z_\, ]+{?([a-zA-Z_\, ]+)}? +from +["']react([a-zA-Z_\, ]?)+["'] ?;?/g;
            // var src_reg = /import +{?([bd-zBD-Z_\, ]+)}? +from +["']..\/..\/src["'] ?;?/g;
            // var src_reg1 = /import +{?([a-zA-Z_\, ]+)}? +from +["']..\/..\/src["'] ?;?/;
            // var extra_src_reg = /import +{?([a-zA-Z_\, ]+)}? +from +["']..\/..\/src\/index(\.js)?["'] ?;?/g;
            // var lib_reg = /import +([a-zA-Z_]+) +from +["']\.\.\/([a-z0-9A-Z-\.]+\/)+([a-z0-9A-Z-\._]+)["']/g;
            // var component_reg = /import +{?([a-zA-Z_\, ]+)}? +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/g;
            // var component_reg1 = /import +{?([a-zA-Z_\, ]+)}? +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/;
            // var data_array = data.match(src_reg),
            //   component_arr = data.match(component_reg),
            //   extra_src_arr = data.match(extra_src_reg),
            //   all_arr = [];
            // if (data_array && data_array.length > 0) {
            //   for (var i = data_array.length - 1; i >= 0; i--) {
            //     all_arr.push(data_array[i].match(src_reg1)[1]);
            //   }
            // }
            // if (component_arr && component_arr.length > 0) {
            //   for (var j = component_arr.length - 1; j >= 0; j--) {
            //     all_arr.push(component_arr[j].match(component_reg1)[1]);
            //   }
            // }
            // data = data.replace(component_reg, "");
            // if(extra_src_arr && extra_src_arr.length > 0){
            //   data = data.replace(
            //     extra_src_reg,
            //     function(match, p1, p2, p3, offset, string) {
            //       //对DatePicker和Timepicker处理成首字母大写
            //       var p1_ = p1;
            //       if(p1_ === 'DatePicker' || p1_ === 'Timepicker'){
            //         p1_ = p1_.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
            //       }
            //       if(all_arr && all_arr.length>0){
            //         return "import " + p1 + ' from "tinper-bee/lib/' + p1_ + '";'+"\nimport { " + all_arr.join(", ") + " } from 'tinper-bee';"
            //       }else{
            //         if(name.toUpperCase().search("AC") != -1 || name.toUpperCase().search("REF") != -1){
            //           return "import " + p1 + ' from "' + name + '";'
            //         }else{
            //           return "import " + p1 + ' from "tinper-bee/lib/' + p1_ + '";'
            //         }
            //       }
            //     }
            //   );  
            // }else if(data_array && data_array.length > 0){
            //     if(name.toUpperCase().search("AC") != -1 || name.toUpperCase().search("REF") != -1){
            //       data = data.replace(
            //         src_reg,
            //         "import  " + all_arr.join(", ") + "  from '"+name+"';");
            //     }else{
            //       data = data.replace(
            //         src_reg,
            //         "import { " + all_arr.join(", ") + " } from 'tinper-bee';");
            //     }
            // }else{
            //   data = data.replace(
            //     react_reg,
            //     function(match, p1, p2, p3, offset, string) {
            //       return match+"\nimport { " + all_arr.join(", ") + " } from 'tinper-bee';"
            //     });
            // }

            // data = data.replace(
            //   lib_reg,
            //   function(match, p1, p2, p3, offset, string) {
            //     //对DatePicker和Timepicker处理成首字母大写
            //     var p1_ = p3;
            //     if(p1_ === 'DatePicker' || p1_ === 'Timepicker'){
            //       p1_ = p1_.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
            //     }
            //     if(name.toUpperCase().search("AC") != -1 || name.toUpperCase().search("REF") != -1){
            //       return "import " + p1 + ' from "' + name + '"';
            //     }else{
            //       return "import " + p1 + ' from "tinper-bee/lib/' + p1_ + '";';
            //     }
            //   }
            // );
            //单独引入的组件
            var externals = ['bee-datepicker', 'bee-timepicker', 'bee-dnd', 'bee-calendar', 'bee-carousel', 'bee-viewer','bee-complex-grid']

            var replaceBees = []

            var beeAry = []; //所有 bee 组件
            //匹配当前组件名称
            var thisBee = /import +([a-zA-Z_]+) +from +["']\.\.\/([a-z0-9A-Z-\.]+\/)+([a-z0-9A-Z-\._]+)["'] ?;?/g;
            //匹配使用到的bee组件
            var bee_reg = /import +{?([a-zA-Z_\, ]+)}? +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/g;
            var bee_reg1 = /import +{?([a-zA-Z_\, ]+)}? +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/;
            //匹配react
            var react_reg = /import[a-zA-Z_\, ]+{?([a-zA-Z_\, ]+)}? +from +["']react([a-zA-Z_\, ]?)+["'] ?;?/g;

            //匹配src
            var src_reg = /import +{?([a-zA-Z_\, ]+)}? +from +["']..\/..\/src["'] ?;?/;

            //匹配src/lib
            // var src_reg_lib = /..\/..\/src\/lib/g;

            //匹配 src/
            var src_reg_ = /..\/..\/src\//g;

            //匹配 from tinper-bee
            var tinperBeeReg = /import +{?([a-zA-Z_\, ]+)}? +from +["']tinper-bee["'] ?;?/;


            //匹配到 from 'bee-xxx'，放到 beeAry数组中，已排除externals内组件
            var component_arr = data.match(bee_reg);
            if (component_arr && component_arr.length > 0) {
              for (var j = component_arr.length - 1; j >= 0; j--) {
                var externalFlag = true;
                var matchs = component_arr[j].match(bee_reg1);
                for (var l = 0; l < externals.length; l++) {
                  if (matchs[0].indexOf(externals[l]) != -1) {
                    externalFlag = false;
                  }
                }
                if (externalFlag) {
                  var component = matchs[1];
                  beeAry.push(component);
                  replaceBees.push(matchs[0])
                }
              }
            }

            //将当前组件放到tinper-bee中引用
            var thisBeeExec = thisBee.exec(data)
            if (thisBeeExec) {
              var thisCom = thisBeeExec[1];
              if (thisCom) {
                if ((externals.indexOf(name) == -1) && (name.split('-')[0] == 'bee')) { //判断是bee开头，而且不被排除的
                  beeAry.push(thisCom)
                } else { //其它组件一律从 name 中引入，例如：ac-xxx,xxx
                  data = data.replace('../../src', name)
                }
              }
            }


            //去掉 from bee-xxx
            if (replaceBees.length > 0) {
              for (var i = 0; i < replaceBees.length; i++) {
                var item = replaceBees[i];
                data = data.replace(item, '')
              }
            }

            //如果有从 tinper-bee 引入的组件 
            var formTinper = tinperBeeReg.exec(data);
            if (formTinper) {
              beeAry.push(formTinper[1]);
              data = data.replace(formTinper[0], '')
            }


            //bee-xxx合并到 tinper-bee里
            data = data.replace(
              react_reg,
              function (match, p1, p2, p3, offset, string) {
                if (beeAry.length > 0) {
                  return match + "\nimport { " + beeAry.join(", ") + " } from 'tinper-bee';"
                } else {
                  return match;
                }
              });

            // 去掉 ../../src  
            var srcMatch = data.match(src_reg);
            if (srcMatch) {
              data = data.replace(srcMatch[0], '')
            }

            // 去掉 ../../src/lib  替换为 组件名/build/lib  例如 bee-table
            // var srcLibMatch =  data.match(src_reg_lib);
            // if(srcLibMatch){
            //   data = data.replace(src_reg_lib,`${name}/build/lib`)
            // }
            // 去掉 ../../src/ 例如 bee-datepicker : import zhCN from "../../src/locale/zh_CN";
            var src_reg_Match =  data.match(src_reg_);
            if(src_reg_Match){
              data = data.replace(src_reg_,`${name}/build/`)
            }

          } catch (e) {
            console.log(e);
          }

          arr.push({
            example: "<" + fileName + " />",
            title: title || fileName,
            code: data,
            desc: desc
          });
          // code.push(data);
          code.push(
            "var " + fileName + ' = require("./demolist/' + fileName + '");'
          );
        } else if (file.search(/Demo\d+.scss/) !== -1) {
          var fileName = file.replace(".scss", "");

          fs.stat(paths + "//" + file, function (err, stat) {
            //console.log(stat);
            if (err) {
              console.log(err);
              return;
            }
            if (stat.isDirectory()) {
              //console.log(paths + "\/" + file + "\/");
              explorer(path + "/" + file);
            } else {
              // console.log(paths + "\/" + file);
            }
          });
          var data = fs.readFileSync(paths + "//" + file, "utf-8");

          scss_arr.push({
            example: "<" + fileName + " />",
            scss_code: data
          });
        }
      });
      for (var index = 0; index < scss_arr.length; index++) {
        var element = scss_arr[index];
        for (var j = 0; j < arr.length; j++) {
          if (element.example === arr[j].example) {
            Object.assign(arr[j], element);
          }
        }
      }

      var index = fs.readFileSync(
        path.join(process.cwd(), "./demo/index-demo-base.js"),
        "utf-8"
      );

      var str = "var DemoArray = " + JSON.stringify(arr) + "\n";

      str = str.replace(/ple":"</gi, 'ple":<').replace(/","tit/gi, ',"tit');

      index = index.replace(/\{demolist\}/, code.join("") + str);
      fs.writeFile(path.join(process.cwd(), "./demo/index.js"), index, function (
        err
      ) {
        if (err) throw err;
        console.log("demo/index.js It's saved!");
        webpack(require("./webpack.dev.js"), function (err, stats) {
          // 重要 打包过程中的语法错误反映在stats中
          console.log("webpack log:" + stats);
          if (err) cb(err);
          console.info("###### pack_demo done ######");
          cb();
        });
      });
    });
  }
  explorer(p);
});

gulp.task("pack_build", ["clean_build"], function (cb) {
  console.log(colors.info("###### pack_build start ######"));
  var pkg = util.getPkg();
  gulp
    .src([
      path.join(process.cwd(), "./src/**/*.js"),
      path.join(process.cwd(), "./src/**/*.jsx")
    ])
    .pipe(
      babel({
        presets: ["react", "es2015-ie", "stage-1"].map(function (item) {
          return require.resolve("babel-preset-" + item);
        }),
        plugins: [
          "transform-object-assign",
          "add-module-exports",
          "transform-object-entries",
          "transform-object-rest-spread"
        ].map(function (item) {
          return require.resolve("babel-plugin-" + item);
        })
      })
    )
    .pipe(es3ify())
    .pipe(gulp.dest("build"))
    .on("end", function () {
      console.log(colors.info("###### pack_build done ######"));
      cb();
    });
});

gulp.task("sass_component", function () {
  gulp
    .src([path.join(process.cwd(), "./src/**/*.scss")])
    .pipe(sass())
    .pipe(gulp.dest("./build"));
  console.log("###### sass_component done ######");
});


gulp.task("svgScript", function () {
  return gulp
    .src([path.join(process.cwd(), "./src/static/**/*.svg")], function (a, b) {
    })
    .pipe(
      svgSymbols({
        slug: name => {
          // console.log("name--", name)
          return name;
        },
      })
    )
    .pipe(rename((path) => {
      path.basename = 'loading';
    }), (a, b) => {
      // console.log("a-", a);
      // console.log("b-", b)
    })
    .pipe(gulp.dest('build/static/images/'));
  // .pipe(gulp.dest('build'));
  // .pipe(gulp.dest(function(file){return 'build/static/images/'+file.base+'.svg';}));
})

gulp.task("sass_demo", function (cb) {
  gulp
    .src([path.join(process.cwd(), "./demo/**/*.scss")])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat("demo.css"))
    .pipe(
      autoprefix({
        browsers: ["last 2 versions", "not ie < 8"],
        cascade: false
      })
    )
    .pipe(
      replace([{
        search: /\/\*#\ssourceMappingURL=([^\*\/]+)\.map\s\*\//g,
        replacement: "/* end for `$1` */\n"
      }])
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist"))
    .on("end", function () {
      console.info(colors.info("###### sass_demo done ######"));
      cb();
    });
});

gulp.task("clean_build", function () {
  return shelljs.rm("-rf", util.getFromCwd("build"));
});

gulp.task("reload_by_js", ["pack_demo"], function () {
  reload();
});

gulp.task("reload_by_demo_css", ["sass_demo"], function () {
  reload();
});

gulp.task("server", ["pack_demo", "sass_demo"], function () {
  var port = util.getPkg().config.port || 3000;
  browserSync({
    server: {
      baseDir: path.join(process.cwd(), "./"),
      port: port
    },
    open: "external"
  });

  gulp.watch(
    [
      path.join(process.cwd(), "./src/**/*.js"),
      path.join(process.cwd(), "./demo/**/*.js")
    ],
    ["reload_by_js"]
  );

  gulp.watch(path.join(process.cwd(), "src/**/*.scss"), ["reload_by_demo_css"]);

  gulp.watch(path.join(process.cwd(), "demo/**/*.scss"), [
    "reload_by_demo_css"
  ]);

  gulp.watch(path.join(process.cwd(), "./demo/demolist/*.js"), ["pack_demo"]);
});

gulp.task("build", ["pack_build", "sass_component", "svgScript"], function () {});

gulp.task("start", ["server"]);

gulp.task("dep", function () {
  var commands = util.getPackages();
  commands.forEach(function (item) {
    util.runCmd("npm", ["i", "-d", item]);
  });
});

gulp.task("update", function () {
  var commands = util.getPackages();
  commands.forEach(function (item) {
    util.runCmd("npm", ["update", "-d", item]);
  });
});

gulp.task("pub", ["pack_build", "sass_component"], async function () {
  let questions = await util.getQuestions();
  let answers = await inquirer.prompt(questions);
  var pkg = util.getPkg();
  pkg.version = answers.version;
  file.writeFileFromString(JSON.stringify(pkg, null, " "), "package.json");

  if (answers.checkChangelog === "y") {
    spawn.sync("git", ["add", "."], {
      stdio: "inherit"
    });
    spawn.sync("git", ["cz"], {
      stdio: "inherit"
    });

    console.log(colors.info("#### Npm Info ####"));
    spawn.sync("bee-tools", ["run", "changelog"], {
      stdio: "inherit"
    });
  }
  console.log(colors.info("#### Git Info ####"));
  spawn.sync("git", ["add", "."], {
    stdio: "inherit"
  });
  spawn.sync("git", ["commit", "-m", "publish " + pkg.version], {
    stdio: "inherit"
  });
  spawn.sync("git", ["tag", "v" + pkg.version]);
  spawn.sync("git", ["push", "origin", "v" + pkg.version], {
    stdio: "inherit"
  });
  spawn.sync("git", ["push", "origin", answers.branch], {
    stdio: "inherit"
  });
  spawn.sync(answers.npm, ["publish"], {
    stdio: "inherit"
  });
  // await global.getGithubToken();
});

gulp.task("releases", async function () {
  await global.getGithubToken();
})