# bee-tools

[![NPM downloads](http://img.shields.io/npm/dm/bee-tools.svg?style=flat)](https://npmjs.org/package/bee-tools)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/tinper-bee/bee-tools.svg)](http://isitmaintained.com/project/tinper-bee/bee-tools "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/tinper-bee/bee-tools.svg)](http://isitmaintained.com/project/tinper-bee/bee-tools "Percentage of issues still open")

tinper-bee 组件库编写组件开发工具

## 下载
```
npm install -g bee-tools

>由于changelog依赖commitizen，所以需要安装commitizen

>npm install -g commitizen

```
## 使用

`cd` 直接进入项目根目录，使用以下命令完成对应功能。


| # | Scripts 脚本命令 | Description 功能描述 |
| --- | --- | --- |
| 1 | bee-tools run dev | 打开浏览器，调试代码和demo |
| 2 | bee-tools run build | 打包代码到build文件夹 |
| 3 | bee-tools run dep | 下载依赖 |
| 4 | bee-tools run update | 更新依赖 |
| 5 | bee-tools run pub | 发布npm包、提交github、生成changelog|
| 6 | bee-tools run loginit | 初始化cz-conventional-changelog |