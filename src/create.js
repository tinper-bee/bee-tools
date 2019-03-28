var path = require('path');
var fse = require('fs-extra');
var fs = require('fs');
//var moment = require('moment');

module.exports = function (name, options) {
    if(!/bee-/.test(name)){
        name = "bee-"+name;
    }
var author = options.author || 'Yonyou FED',
    pkgName = options.pkgName || name,
    version = options.tbVersion || '0.0.1',
    repoUrl = options.repoUrl || 'https://github.com/tinper-bee/' + name + '.git',
    port = options.port || 3000;




    if(!/bee-/.test(name)){
        console.log('component name should be bee-componentName');
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
"class " + AppName + " extends Component {render(){return(<h2>Welcome use tinper-bee</h2> )}};",
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
//   '@import "../node_modules/tinper-bee-core/scss/index.scss";',
  '@import "../src/' + AppName + '.scss";',
//   '@import "../node_modules/bee-panel/src/Panel.scss";',
//   '@import "../node_modules/bee-layout/src/Layout.scss";',
//   '@import "../node_modules/bee-button/src/Button.scss";',
//   '@import "../node_modules/bee-transition/src/Transition.scss";'
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
        file: path.resolve(name, 'src', AppName + '.scss'),
        content: srcComponentScss
    },
    {
        file: path.resolve(name, 'demo', AppName + 'Demo.scss'),
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

function camelCase(name) {
  return name.replace(/-\w/g, function (m) {
    return m.charAt(1).toUpperCase();
  })
}
}
