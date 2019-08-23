//bee-xx 从tinper-bee中引入
//bee-xx-xx 从tinper-bee中引入
// 特殊的几个单独引入
// 其它的 ../../src 改为 组件名称


var fs = require("fs");

var data = fs.readFileSync('./Demo1.js', "utf-8");


var libBee = ['Datepicker','Timepicker','Dnd','Calendar','Carousel','Viewer']


// data = data.replace(/export(\s+)(.*)/gi, "");

// console.log(data);

// fs.writeFileSync('demo.js',data)

var name = 'bee-colorpicker';
// var beeAry=[];//所有 bee 组件
// var bee_reg = /import +{?([a-zA-Z_\, ]+)}? +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/g;
// var bee_reg1 = /import +{?([a-zA-Z_\, ]+)}? +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/;

// var component_arr = data.match(bee_reg);//匹配到 from 'bee-xxx'

// if (component_arr && component_arr.length > 0) {
//     for (var j = component_arr.length - 1; j >= 0; j--) {
//         // console.log(component_arr[j].match(bee_reg1)[1])
//         beeAry.push(component_arr[j].match(bee_reg1)[1]);
//     }
// }


// console.log(data.match(bee_reg))

//替换
var react_reg = /import[a-zA-Z_\, ]+{?([a-zA-Z_\, ]+)}? +from +["']react([a-zA-Z_\, ]?)+["'] ?;?/g;
var src_reg = /import +{?([bd-zBD-Z_\, ]+)}? +from +["']..\/..\/src["'] ?;?/g;
var src_reg1 = /import +{?([a-zA-Z_\, ]+)}? +from +["']..\/..\/src["'] ?;?/;
var extra_src_reg = /import +{?([a-zA-Z_\, ]+)}? +from +["']..\/..\/src\/index(\.js)?["'] ?;?/g;
var lib_reg = /import +([a-zA-Z_]+) +from +["']\.\.\/([a-z0-9A-Z-\.]+\/)+([a-z0-9A-Z-\._]+)["'] ?;?/g;
var component_reg = /import +{?([a-zA-Z_\, ]+)}? +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/g;
var component_reg1 = /import +{?([a-zA-Z_\, ]+)}? +from +["']bee-[a-zA-Z-]+["'] ?;?[\r\n]?/;
var data_array = data.match(src_reg),
  component_arr = data.match(component_reg),
  extra_src_arr = data.match(extra_src_reg),
  all_arr = [];
if (data_array && data_array.length > 0) {console.log('1')
  for (var i = data_array.length - 1; i >= 0; i--) {
    all_arr.push(data_array[i].match(src_reg1)[1]);
  }
}
if (component_arr && component_arr.length > 0) {console.log('2')
  for (var j = component_arr.length - 1; j >= 0; j--) {
    var component = component_arr[j].match(component_reg1)[1];
    if(libBee.indexOf(component)==-1)all_arr.push(component_arr[j].match(component_reg1)[1]);
  }
}
//将组件放到tinper-bee组件数组里
console.log(lib_reg.exec(data))
var thisCom = lib_reg.exec(data)&&lib_reg.exec(data)[1];
console.log(thisCom) 
if(thisCom){
    all_arr.push(thisCom)
}

data = data.replace(component_reg, "");
if(extra_src_arr && extra_src_arr.length > 0){console.log(3)
  data = data.replace(
    extra_src_reg,
    function(match, p1, p2, p3, offset, string) {
      //对DatePicker和Timepicker处理成首字母大写
      var p1_ = p1;
      if(p1_ === 'DatePicker' || p1_ === 'Timepicker'){
        p1_ = p1_.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
      }
      if(all_arr && all_arr.length>0){console.log('4')
        return "import " + p1 + ' from "tinper-bee/lib/' + p1_ + '";'+"\nimport { " + all_arr.join(", ") + " } from 'tinper-bee';"
      }else{console.log('5')
        if(name.toUpperCase().search("AC") != -1 || name.toUpperCase().search("REF") != -1){
          return "import " + p1 + ' from "' + name + '";'
        }else{
          return "import " + p1 + ' from "tinper-bee/lib/' + p1_ + '";'
        }
      }
    }
  );  
}else if(data_array && data_array.length > 0){console.log('6')
    if(name.toUpperCase().search("AC") != -1 || name.toUpperCase().search("REF") != -1){
      data = data.replace(
        src_reg,
        "import  " + all_arr.join(", ") + "  from '"+name+"';");
    }else{
      data = data.replace(
        src_reg,
        "import { " + all_arr.join(", ") + " } from 'tinper-bee';");
    }
}else{
    console.log('7')
  data = data.replace(
    react_reg,
    function(match, p1, p2, p3, offset, string) {
        if(all_arr.length>0){
            return match+"\nimport { " + all_arr.join(", ") + " } from 'tinper-bee';"
        }
    });
}

data = data.replace(
  lib_reg,
  function(match, p1, p2, p3, offset, string) {
      console.log('8')
      console.log(match,p1,p3)
    //对DatePicker和Timepicker处理成首字母大写
    var p1_ = p3;
    if(p1_ === 'DatePicker' || p1_ === 'Timepicker'){console.log('9')
      p1_ = p1_.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }
    if(name.toUpperCase().search("AC") != -1 || name.toUpperCase().search("REF") != -1){
      return "import " + p1 + ' from "' + name + '"';
    }else{console.log('10')
      return ''
    }
  }
);


console.log(data);

fs.writeFileSync('demo.js',data)