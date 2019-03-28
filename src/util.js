var file = require('html-wiring');
var path = require('path');
var Promise = require('promise');
var git = require('git-rev');
var fs = require('fs');
// var pkg = getPackage();
var pkg = JSON.parse(file.readFileAsString('package.json'));

async function getPackage() {
    if(fsExistsSync("package.json")){
        let _pack = JSON.parse(await fs.readFileSync(path.join("package.json"),'utf-8'));
        return _pack;
    }
    return "";
}

//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

// if(file.readFileAsString('package.json')){
//     pkg = JSON.parse(file.readFileAsString('package.json'));
// }
// // var pkg = JSON.parse(file.readFileAsString('package.json'));

var utils = {
    versionCompare: function(a, b) {
        var aArr = a.split('.');
        var bArr = b.split('.');
        var larger = false;
        for (var i = 0; i < 3; i++) {
            if (parseInt(aArr[i]) === parseInt(bArr[i])) {

            }
            else {
                larger = parseInt(aArr[i]) > parseInt(bArr[i]);
                break;
            }
        }
        return larger;
    },
    runCmd: function(cmd, args, fn) {
        args = args || [];
        var runner = require('child_process').spawn(cmd, args, {
            // keep color
            stdio: 'inherit',
        });
        runner.on('close', (code) => {
            if (fn) {
                fn(code);
            }
        });
    },
    getFromCwd: function() {
        var args = [].slice.call(arguments, 0);
        args.unshift(process.cwd());
        return path.join.apply(path, args);
    },
    getPkg: function() {
        return JSON.parse(file.readFileAsString('package.json'));;
    },
    getPackages: function() {
        if(!pkg){
            pkg = this.getPkg();
        }
        var commands = [];
        for (var item in pkg.devDependencies) {
            if (item !== 'bee-tools') {
                commands.push(item + '@' + pkg.devDependencies[item]);
            }
        }
        commands.push('--production');
        return commands;
    },
    getQuestions:async function() {
        if(!pkg){
            pkg = getPkg();
        }
        var me = this;
        return new Promise(function(resolve, reject) {
            git.branch(function(branch) {
                var defaultBranch = branch;
                var defaultNpm = /@ali/.test(pkg.name) ? 'tnpm' : 'npm';
                var questions = [
                    {
                        type: 'input',
                        name: 'version',
                        message: 'please enter the package version to publish (should be xx.xx.xx)',
                        default: pkg.version,
                        validate: function(input) {
                            if (/\d+\.\d+\.\d+/.test(input)) {
                                if (me.versionCompare(input, pkg.version)) {
                                    return true;
                                }
                                else {
                                    return "the version you entered should be larger than now"
                                }
                            }
                            else {
                                return "the version you entered is not valid"
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'branch',
                        message: 'which branch you want to push',
                        default: defaultBranch
                    },
                    {
                        type: 'input',
                        name: 'npm',
                        message: 'which npm you want to publish',
                        default: defaultNpm,
                        validate: function(input) {
                            if (/npm/.test(input)) {
                                return true;
                            }
                            else {
                                return "it seems not a valid npm"
                            }
                        }
                    },
                     {
                        type: 'input',
                        name: 'checkChangelog',
                        message: 'do you wang run changelog ?(y/n)',
                        default: 'y'
                    }
                ];
                resolve(questions);
            });
        })
    }
}

module.exports = utils;
