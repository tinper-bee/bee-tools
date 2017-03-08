# bee-tools

[![NPM downloads](http://img.shields.io/npm/dm/bee-tools.svg?style=flat)](https://npmjs.org/package/bee-tools)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/tinper-bee/bee-tools.svg)](http://isitmaintained.com/project/tinper-bee/bee-tools "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/tinper-bee/bee-tools.svg)](http://isitmaintained.com/project/tinper-bee/bee-tools "Percentage of issues still open")

tinper-bee 组件库编写组件开发工具

## 下载
```
npm install -g bee-tools
```
## 使用

`cd` 直接进入项目根目录，使用以下命令完成对应功能。


| # | Scripts 脚本命令 | Description 功能描述 |
| --- | --- | --- |
| 1 | bee-tools run dev | 打开浏览器，调试代码和demo |
| 2 | bee-tools run build | 打包代码到build文件夹 |
| 8 | bee-tools run dep | 下载依赖 |
| 9 | bee-tools run update | 更新依赖 |
| 10 | bee-tools run pub | 发布npm包 |

## 几个使用建议

- `mac` 用户安装 `bee-tools` 后提示`env: node\r: No such file or directory`

请下载dos2unix，具体操作如下：
```
$brew install dos2unix
$cd /usr/local/lib/node_modules/bee-tools/bin
$sudo dos2unix bee-tools-run.js bee-tools.js
```

- 下载 `bee-tools` 速度较慢

建议使用 `cnpm` 进行下载

```
sudo npm install cnpm -g
cnpm install bee-tools -g
```
