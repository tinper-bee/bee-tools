# bee-tools
tinper-bee 组件库编写组件开发工具

## 下载
```
npm install -g bee-tools
```
## 使用
直接进入项目根目录进行使用

## API

bee-tools run dev 打开浏览器，调试代码和demo
bee-tools run build 打包代码到build文件夹
bee-tools run lint 跑lint测试
bee-tools run test 跑自动测试
bee-tools run coverage 测试覆盖率
bee-tools run chrome 跑chrome测试
bee-tools run browsers 跑浏览器测试
bee-tools run dep 下载依赖
bee-tools run update 更新依赖
bee-tools run pub 发布npm包

如果mac使用bee-tools提示`env: node\r: No such file or directory`
请下载dos2unix
```
$brew install dos2unix
$cd /usr/local/lib/node_modules/bee-tools/bin
$sudo dos2unix bee-tools-run.js bee-tools.js
```
