//bee-xx 从tinper-bee中引入
//bee-xx-xx 从tinper-bee中引入
// 特殊的几个单独引入
// 其它的 ../../src 改为 组件名称


var fs = require("fs");

var data = fs.readFileSync('./Demo1.js', "utf-8");


//单独引入的组件
var externals = ['bee-datepicker','bee-timepicker','bee-dnd','bee-calendar','bee-carousel','bee-viewer']

var replaceBees=[]

var name = 'zzz';
var beeAry=[];//所有 bee 组件
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
      for(var l = 0;l<externals.length;l++){
        if(matchs[0].indexOf(externals[l])!=-1){
          externalFlag=false;
        }
      }
      if(externalFlag){
        var component = matchs[1];
        beeAry.push(component);
        replaceBees.push(matchs[0])
      }
    }
}

//将当前组件放到tinper-bee中引用
var thisBeeExec = thisBee.exec(data)
if(thisBeeExec){
  var thisCom = thisBeeExec[1];
  if(thisCom){
    if((externals.indexOf(name)==-1)&&(name.split('-')[0]=='bee')){//判断是bee开头，而且不被排除的
      beeAry.push(thisCom)
    }else{//其它组件一律从 name 中引入，例如：ac-xxx,xxx
      data=data.replace('../../src',name)
    }
  }
}


//去掉 from bee-xxx
if(replaceBees.length>0){
  for(var i = 0; i<replaceBees.length; i++){
    var item  = replaceBees[i];
    data = data.replace(item,'')
  }
}

//如果有从 tinper-bee 引入的组件 
var formTinper = tinperBeeReg.exec(data);
if(formTinper){
  beeAry.push(formTinper[1]);
  data=data.replace(formTinper[0],'')
}


//bee-xxx合并到 tinper-bee里
data = data.replace(
  react_reg,
  function(match, p1, p2, p3, offset, string) {
      if(beeAry.length>0){
          return match+"\nimport { " + beeAry.join(", ") + " } from 'tinper-bee';"
      }else{
        return match;
      }
});

var srcMatch =  data.match(src_reg);
if(srcMatch){
  data = data.replace(srcMatch[0],'')
}



// var srcLibMatch =  data.match(src_reg_lib);
// if(srcLibMatch){
//   data = data.replace(src_reg_lib,`${name}/build/lib`)
// }


var src_reg_Match =  data.match(src_reg_);
if(src_reg_Match){
  data = data.replace(src_reg_,`${name}/build/`)
}


console.log(data);

