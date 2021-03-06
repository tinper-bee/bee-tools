var path = require('path');
var fse = require('fs-extra');
var fs = require('fs');
const spawn = require('cross-spawn');
var inquirer = require("inquirer");
const propertiesParser = require('properties-parser')

module.exports = async function (name, options) {
    if(!/ac-/.test(name)){
        name = "ac-"+name;
    }
    var author = options.author || 'Yonyou FED',
        pkgName = options.pkgName || name,
        version = options.tbVersion || '0.0.1',
        repoUrl = options.repoUrl || 'https://github.com/tinper-acs/' + name + '.git',
        port = options.port || 3000;
    
        if(!/ac-/.test(name)){
            console.log('component name should be ac-componentName');
            return;
        }
        //创建基本目录
    fse.mkdirsSync(path.resolve(name, 'src'));
    fse.mkdirsSync(path.resolve(name, 'demo'));
    fse.mkdirsSync(path.resolve(name, 'demo/demolist'));
    fse.mkdirsSync(path.resolve(name, 'test'));
    fse.mkdirsSync(path.resolve(name, 'docs'));
    var templateDir = path.resolve(__dirname, '../templates');

    fse.copySync(templateDir, name);

    var appname = name.replace(/\s/g, '-').split("-").splice(1).join('-');
    var AppName = appname.charAt(0).toUpperCase() + camelCase(appname.slice(1));

    var srcComponentContent = [
    "import React, { Component } from 'react';",
    "import PropTypes from 'prop-types';",
    "const propTypes = {};",
    "const defaultProps = {};",
    "class " + AppName + " extends Component {render(){return(<h2>Welcome use tinper-acs </h2> )}};",
    AppName + ".propTypes = propTypes;",
    AppName + ".defaultProps = defaultProps;",
    "export default " + AppName + ";"
    ].join('\n');

    var srcIndexContent = [
        "import " +  AppName  +　" from './" +　AppName +　"';",
        "export default " + AppName + ";"
    ].join('\n');

    var srcComponentScss = [
    '@import "../node_modules/tinper-bee-core/scss/minxin-variables";',
    '@import "../node_modules/tinper-bee-core/scss/minxin-mixins";'
    ].join('\n');

    var demoScss = [
    '@import "../src/' + AppName + '.less";',
    ].join('\n');

    var demojs = [
    "import " + AppName + " from '../src/index';",
    "import React, { Component } from 'react';",
    "import ReactDOM from 'react-dom';",
    "class Demo extends Component {render(){return( <" + AppName + "/> )}}",
    "export default Demo;"
    ].join('\n');

    var demoIndexJs = [
    "import Demo from './" + AppName + "Demo';",
    "import ReactDOM from 'react-dom';",
    "ReactDOM.render(<Demo/>, document.getElementById('tinperBeeDemo'));"
    ].join('\n');

    var testComponentjs = [
    "import React from 'react';",
    "import {shallow, mount, render} from 'enzyme';",
    "import {expect} from 'chai';",
    "import " + AppName + " from '../src/index';"
    ].join('\n');

    var docsContent = [
        "# "+AppName,
        "\n\n ## 何时使用",
        "\n\n ## 如何使用",
        "\n\n ## 代码演示",
        "\n ## API",
        "\n |参数|说明|类型|默认值|",
        "|:---|:-----|:----|:------|",
        "\n\n ## 注意事项",
        "\n 暂无",
        "\n ## 更新日志",
    ].join('\n');

    var docsContentEn = [
        "# "+AppName,
        "\n\n ## When to use",
        "\n\n ## How to use",
        "\n\n ## Code display",
        "\n ## API",
        "\n |Property|Description|Type|Default|",
        "|:---|:-----|:----|:------|",
        "\n\n ## 注意事项",
        "\n 暂无",
        "\n ## 更新日志",
    ].join('\n');

    var demo1 = [
        "/**",
        "*",
        "* @title 这是标题",
        "* @description 这是描述",
        "*",
        "*/",
        "import React, { Component } from 'react';",
        "class Demo1 extends Component {",
        "render () {",
        "return (",
        "<div>",
        "欢迎使用老赵DEMO系统",
        "</div>",
        ")",
        "}",
        "}",
        "export default Demo1"
    ].join('\n');

    var mapFileContent = [
        {
            file: path.resolve(name, 'src', AppName + '.js'),
            content: srcComponentContent
        },
        {
            file: path.resolve(name, 'src', 'index.js'),
            content: srcIndexContent
        },
        {
            file: path.resolve(name, 'src', AppName + '.less'),
            content: srcComponentScss
        },
        {
            file: path.resolve(name, 'demo', AppName + 'Demo.less'),
            content: demoScss
        },
        {
            file: path.resolve(name, 'demo', AppName + 'Demo.js'),
            content: demojs
        },
        //{
        //    file: path.resolve(name, 'demo', 'index.js'),
        //    content: demoIndexJs
        //},
        {
            file: path.resolve(name, 'test','index.test.js'),
            content: testComponentjs
        },
        {
            file: path.resolve(name, 'docs','api.md'),
            content: docsContent
        },
        {
            file: path.resolve(name, 'docs','api_en.md'),
            content: docsContentEn
        },
        {
            file: path.resolve(name, 'demo','demolist','Demo1.js'),
            content: demo1
        }
    ]

    function writeFile(content, file){
        fse.outputFile(file, content, function (err) {
            if(err) throw err; // => null

        });
    }
    //写入文件
    for(var i = 0, len = mapFileContent.length; i < len; i ++){
        var fileObject = mapFileContent[i];
        writeFile(fileObject.content, fileObject.file);
    }



    fs.renameSync(path.resolve(name, 'gitignore'), path.resolve(name, '.gitignore'));
    fs.renameSync(path.resolve(name, 'npmignore'), path.resolve(name, '.npmignore'));


    function replaceVariate (file, changeArray) {
        fs.readFile(path.resolve(name, file),{encoding:'utf-8'}, function (err,bytesRead) {
            if (err) throw err;
            //var data=JSON.parse(bytesRead);
            //<%= packageName%>
            var content = bytesRead,
                changeMap,
                replaceRegexp;
            if(changeArray){
                for(var i = 0, len = changeArray.length; i < len; i ++) {
                    changeMap = changeArray[i];
                    replaceRegexp = new RegExp(changeMap.old, 'g');
                    content = content.replace(replaceRegexp, changeMap.new);
                }
            }

            fse.outputFile(path.resolve(name, file), content, function (err) {
                if(err) throw err; // => null

            });

        });
    }
    replaceVariate('README.md', [{ old: '<%= packageName%>', new: name}]);
    replaceVariate('README_EN.md', [{ old: '<%= packageName%>', new: name}]);
    replaceVariate('package.json', [
        { old: '<%= packageName%>', new: name},
        { old: '<%= version%>', new: version},
        { old: '<%= port%>', new: port},
        { old: '<%= appname%>', new: AppName},
        { old: '<%= author%>', new: author},
        { old: '<%= repo_url%>', new: repoUrl}
    ]);
    replaceVariate('./demo/index-demo-base.js', [{ old: '<%= appname%>', new: AppName}]);
    queryInstall(name);
    function camelCase(name) {
        return name.replace(/-\w/g, function (m) {
            return m.charAt(1).toUpperCase();
        })
    }
}


function queryInstall(name) {
    let  questions = {
         type: 'input',
         name: 'name',
         message: 'Automatically install YNPM dependent packages ?',
         default: function() {
             return 'y/n'
         }
     }
     inquirer.prompt(questions).then(function(answers) {
         if(answers.name.toLowerCase() === "y"){
             let url = process.cwd()+"/"+name;
             process.chdir(url);
             install();
         }
     })
 }

function install(){
    console.log(`Install YNPM dependence packages,please wait.`);
    var args = ['install'].filter(function(e) {
        return e;
    });
    var proc = spawn('ynpm', args, {
        stdio: 'inherit'
    });
    proc.on('close', function(code) {
        if (code !== 0) {
            console.error('`ynpm ' + args.join(' ') + '` failed');
            return;
        }
        console.log(`YNPM package installed `);
    });
}