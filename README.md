# bee-tools

[![NPM downloads](http://img.shields.io/npm/dm/bee-tools.svg?style=flat)](https://npmjs.org/package/bee-tools)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/tinper-bee/bee-tools.svg)](http://isitmaintained.com/project/tinper-bee/bee-tools "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/tinper-bee/bee-tools.svg)](http://isitmaintained.com/project/tinper-bee/bee-tools "Percentage of issues still open")

tinper-bee 组件库编写组件开发工具
bee-tools 集成了ynpm 包的安装，新增了包的发布，且自动生成releases，并解决了不兼容node>8的版本报错的问题。

## 下载
```
npm install -g bee-tools

>由于changelog依赖commitizen，所以需要安装commitizen

>npm install -g commitizen

```
## 使用

`cd` 直接进入项目根目录，使用以下命令完成对应功能。

### 初始化项目

```
bee-tools create 组件名称

选择组件类型，应用组件选择 ac-xxx component。 基础组件选择 bee-xxx component

```

### 本地运行

```
修改 demo/demolist/Demo1.js 文件内容

运行 npm run dev 即可

新增demo请在 demo/demolist下新建文件，例如 Demo2.js、Demo3.js等

```

### 发布到 npm 上

```
运行 npm run pub 
填写 changelog，会提交到git并发布
```



| # | Scripts 脚本命令 | Description 功能描述 |
| --- | --- | --- |
| 1 | bee-tools create ac-xx/bee-xx | 创建项目(应用组件、基础组件) |
| 2 | bee-tools run dev | 打开浏览器，调试代码和demo |
| 3 | bee-tools run build | 打包代码到build文件夹 |
| 4 | bee-tools run pub | 集成了(发布npm包、提交github、生成changelog)功能|
| 5 | bee-tools run dep | 下载依赖 |
| 6 | bee-tools run update | 更新依赖 |
| 7 | bee-tools run changelogInit | 初始化cz-conventional-changelog |
| 8 | bee-tools run changelog | 生成CHANGELOG.md |
| 9 | bee-tools run releases | 创建releases |
