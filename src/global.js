var propertiesParser = require('properties-parser')
var file = require('html-wiring');
var path = require('path');
var Promise = require('promise');
var git = require('git-rev');
var fs = require('fs');
var inquirer = require("inquirer");
const gh = require('ghreleases');

var  filePath = process.env.HOME+"/.bee-tools";

var utils = {
  setRcFile,
  getProPack,
  getGithubToken
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

function getRcFileDate(){
  let data = null;
  if(fsExistsSync(filePath)){
      return propertiesParser.read(filePath);
  }
  return null;
}

function setRcFile(data){
  let editor = propertiesParser.createEditor();
  for (var item in data) {
    editor.set(item, data[item]);
  }
  fs.writeFileSync(filePath,editor.toString());
}

async function getProPack(data){
  let _package = await fs.readFileSync(path.join(process.cwd()+"/package.json"),'utf-8')
  if(!_package){
    console.log(comp+" path is error ,please go to tinper-bee directory to execute this command !");
    return null;
}
return JSON.parse(_package);
}


async function getGithubToken(){
  let data = getRcFileDate(),token = "";
  if(!data || !data.token){
      var getToken = require('./tokenIndex.js')
      getToken(['repo'], new Date().getTime(), 'http://noteurl.com/',async function(err, _data) {
          console.log("-result-");
          console.log(_data);
          setRcFile(_data);
          await createRelease(_data);
      });
  }else{
      await createRelease(data);
  }
}

async function createRelease(auth){
  let  questions = {
      type: 'input',
      name: 'describe',
      message: 'Describe this release '
  }
  let answers = await inquirer.prompt(questions);
  pack = await getProPack();
  if(!pack){
      console.log(" createRelease function get pack is not define null ! ");
      return;
  };
  const data = {
      tag_name:(pack.name+"v"+pack.version),
      name: ("v"+pack.version),
      body: answers.describe
  }
  gh.create(auth,'tinper-acs', pack.name, data, (err, release) => {
      console.log(err?err:"create release is success !");
  })
}


module.exports = utils;


  // var tinperPath =  process.cwd();
  // console.log("__dirname",process.__dirname);
  // console.log("__filename",filePath);
  // let data = propertiesParser.read(filePath);
  // console.log("__filename",data.name);
  


  // const gh = require('ghreleases')
  // const auth = {
  //     token: '5c6dbebde5935b9edf9cf778185f892a0a119646',
  //     user: 'jonyshi'
  //   }
  // const data = {
  //     tag_name: '1.2.3-test',
  //     name: 'Release name for 1.2.3-test',
  //     body: 'Body text of release goes here'
  //   }
  //   gh.create(auth,'tinper-acs', 'ac-test', data, (err, release) => {
  //     console.log("create release is success ! ")
  //   })