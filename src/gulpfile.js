// dependency
var fs = require("fs");
var inquirer = require("inquirer");
var spawn = require("cross-spawn");
var file = require("html-wiring");
var colors = require("colors/safe");
var util = require("./util");
var path = require("path");

var browserSync = require("browser-sync");
var reload = browserSync.reload;
var shelljs = require("shelljs");

// gulp & gulp plugin
var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var autoprefix = require("gulp-autoprefixer");
var concat = require("gulp-concat");
var replace = require("gulp-just-replace");
var es3ify = require("gulp-es3ify");
var eslint = require("gulp-eslint");
var conven = require("gulp-conventional-changelog");
var fse = require("fs-extra");

// webpack
var webpack = require("webpack");

colors.setTheme({
  info: ["bold", "green"]
});

gulp.task("changelogInit", function() {
  //设置镜像
  spawn.sync(
    "npm",
    ["--registry", "https://registry.npm.taobao.org", "install", "express"],
    { stdio: "inherit" }
  );
  //init commitizen
  spawn.sync(
    "commitizen",
    ["init", "cz-conventional-changelog", "--save", "--save-exact", "--force"],
    { stdio: "inherit" }
  );
});

gulp.task("changelog", function() {
  console.log(colors.info("###### build changelog ######"));
  if (!fs.existsSync("CHANGELOG.md")) {
    fse.outputFileSync(path.join(process.cwd(), "./CHANGELOG.md"), "", function(
      err
    ) {
      if (err) throw err; // => null
    });
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

gulp.task("pack_demo", function(cb) {
  var p = path.join(process.cwd(), "./demo/demolist");

  function explorer(paths) {
    var arr = [],
      scss_arr = [],
      code = [];
    fs.readdir(paths, function(err, files) {
      if (err) {
        console.log("error:\n" + err);
        return;
      }

      files.forEach(function(file) {
        if (file.search(/Demo\d+.js/) !== -1) {
          var fileName = file.replace(".js", "");

          fs.stat(paths + "//" + file, function(err, stat) {
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
            title = data.match(/@title.{0,20}/) || [];
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
            data = data.replace(/export(\s+)(.*)/gi, "");
            var package = fs.readFileSync(
              path.join(process.cwd(), "./package.json"),
              "utf-8"
            );
            var name = JSON.parse(package).name;
            var src_reg = /import +([a-zA-Z]+) +from +["']..\/..\/src["'] ?;?/g;
            var src_reg1 = /import +([a-zA-Z]+) +from +["']..\/..\/src["'] ?;?/;
            var lib_reg = /import +([a-zA-Z]+) +from +["']\.\.\/([a-z0-9A-Z-\.]+\/)+([a-z0-9A-Z-\.]+)["']/g;
            var lib_reg1 = /import +([a-zA-Z]+) +from +["']\.\.\/([a-z0-9A-Z-\.]+\/)+([a-z0-9A-Z-\.]+)["']/;
            var component_reg = /import +([a-zA-Z]+) +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/g;
            var component_reg1 = /import +([a-zA-Z]+) +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/;
            var data_array = data.match(src_reg),
              component_arr = data.match(component_reg),
              lib_arr = data.match(lib_reg),
              all_arr = [];
            if (data_array && data_array.length > 0) {
              for (var i = data_array.length - 1; i >= 0; i--) {
                all_arr.push(data_array[i].match(src_reg1)[1]);
              }
            }
            if (component_arr && component_arr.length > 0) {
              for (var j = component_arr.length - 1; j >= 0; j--) {
                all_arr.push(component_arr[j].match(component_reg1)[1]);
              }
            }
            if (lib_arr && lib_arr.length > 0) {
              for (var j = lib_arr.length - 1; j >= 0; j--) {
                data.replace(
                  src_reg,
                  "import { " + all_arr.join(", ") + " } from 'tinper-bee';"
                );
              }
            }
            data = data.replace(
              src_reg,
              "import { " + all_arr.join(", ") + " } from 'tinper-bee';"
            );
            data = data.replace(component_reg, "");
            data = data.replace(
              /import +([a-z0-9A-Z]+) +from +["']\.\.\/([a-z0-9A-Z-\.]+\/)+([a-z0-9A-Z-\.]+)["']/g,
              function(match, p1, p2, p3, offset, string) {
                return "import " + p1 + ' from "tinper-bee/lib/' + p3 + '";';
              }
            );

            //
            // if(data.match(/import(\s+)(.*)(\s+)(from)(\s+)\'tinper-bee\'/ig)[0].match(/{/)== null){
            //     data = data.replace(/import(\s+)(.*)(\s+)(from)(\s+)\'tinper-bee\'/ig,'import$1{$2}$3$4$5\'tinper-bee\'')
            // }
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

          fs.stat(paths + "//" + file, function(err, stat) {
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
          for(var j = 0; j<arr.length; j++){
              if(element.example === arr[j].example){
                Object.assign(arr[j],element);
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

      fs.writeFile(path.join(process.cwd(), "./demo/index.js"), index, function(
        err
      ) {
        if (err) throw err;
        console.log("demo/index.js It's saved!");
        webpack(require("./webpack.dev.js"), function(err, stats) {
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

gulp.task("pack_build", ["clean_build"], function(cb) {
  console.log(colors.info("###### pack_build start ######"));
  var pkg = util.getPkg();
  gulp
    .src([
      path.join(process.cwd(), "./src/**/*.js"),
      path.join(process.cwd(), "./src/**/*.jsx")
    ])
    .pipe(
      babel({
        presets: ["react", "es2015-ie", "stage-1"].map(function(item) {
          return require.resolve("babel-preset-" + item);
        }),
        plugins: [
          "transform-object-assign",
          "add-module-exports",
          "transform-object-entries",
          "transform-object-rest-spread"
        ].map(function(item) {
          return require.resolve("babel-plugin-" + item);
        })
      })
    )
    .pipe(es3ify())
    .pipe(gulp.dest("build"))
    .on("end", function() {
      console.log(colors.info("###### pack_build done ######"));
      cb();
    });
});

gulp.task("sass_component", function() {
  gulp
    .src([path.join(process.cwd(), "./src/**/*.scss")])
    .pipe(sass())
    .pipe(gulp.dest("./build"));
  console.log("###### sass_component done ######");
});

gulp.task("sass_demo", function(cb) {
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
      replace([
        {
          search: /\/\*#\ssourceMappingURL=([^\*\/]+)\.map\s\*\//g,
          replacement: "/* end for `$1` */\n"
        }
      ])
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist"))
    .on("end", function() {
      console.info(colors.info("###### sass_demo done ######"));
      cb();
    });
});

gulp.task("clean_build", function() {
  return shelljs.rm("-rf", util.getFromCwd("build"));
});

gulp.task("reload_by_js", ["pack_demo"], function() {
  reload();
});

gulp.task("reload_by_demo_css", ["sass_demo"], function() {
  reload();
});

gulp.task("server", ["pack_demo", "sass_demo"], function() {
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

gulp.task("build", ["pack_build", "sass_component"], function() {});

gulp.task("start", ["server"]);

gulp.task("dep", function() {
  var commands = util.getPackages();
  commands.forEach(function(item) {
    util.runCmd("npm", ["i", "-d", item]);
  });
});

gulp.task("update", function() {
  var commands = util.getPackages();
  commands.forEach(function(item) {
    util.runCmd("npm", ["update", "-d", item]);
  });
});

gulp.task("pub", ["pack_build", "sass_component"], function() {
  util.getQuestions().then(function(questions) {
    inquirer.prompt(questions).then(function(answers) {
      var pkg = util.getPkg();
      pkg.version = answers.version;
      file.writeFileFromString(JSON.stringify(pkg, null, " "), "package.json");

      if (answers.checkChangelog === "y") {
        spawn.sync("git", ["add", "."], { stdio: "inherit" });
        spawn.sync("git", ["cz"], { stdio: "inherit" });

        console.log(colors.info("#### Npm Info ####"));
        spawn.sync("bee-tools", ["run", "changelog"], { stdio: "inherit" });
      }
      console.log(colors.info("#### Git Info ####"));
      spawn.sync("git", ["add", "."], { stdio: "inherit" });
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
      spawn.sync(answers.npm, ["publish"], { stdio: "inherit" });
    });
  });
});
