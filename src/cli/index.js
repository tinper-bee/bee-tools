#!/usr/bin/env node
'use strict';
var program = require('commander');
var inquirer = require("inquirer");
var packageInfo = require('../../package.json');

var questions = {
    component:{
        type: 'list',
        name: 'choose',
        message: 'Please choose ?',
        choices:["ac-xx component","bee-xx component"],
        default: function() {
            return 'Default is ac-xx '
        }
    }
}

program
    .version(packageInfo.version)
    .command('run [name]', 'run specified task');


// https://github.com/tj/commander.js/pull/260
var proc = program.runningCommand;
if (proc) {
    proc.on('close', process.exit.bind(process));
    proc.on('error', function() {
        process.exit(1);
    });
}

//脚手架开始
program
    .command('create [dir]')
    .description('生成一个空组件')
    .option('-a, --author <name>', '作者')
    .option('-p, --port <port>', '服务端口号')
    .option('--pkgName <pkgName>', '模块名')
    .option('-v, --tbVersion <version>', '版本号')
    .option('-r, --repoUrl <repoUrl>', '仓库地址')
    .action(function (dir,otherDirs){
        inquirer.prompt(questions.component).then(function(answers) {
            if(/bee-/.test(dir)){
                console.log("answers ---333- ",answers);
                require('../create')(dir,otherDirs);
            }else{
                console.log("answers ---- ",answers);
                require('../create-acs')(dir,otherDirs);
            }
        });
    });

program.parse(process.argv);


// var subCmd = program.args[0];

// if (!subCmd || !(subCmd == 'run' || subCmd == 'create')) {
//     program.help();
// }