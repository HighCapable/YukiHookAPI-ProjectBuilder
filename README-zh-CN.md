# YukiHookAPI Project Builder

![Blank](https://img.shields.io/badge/license-AGPL3.0-blue)
![Blank](https://img.shields.io/badge/version-v1.0.2-green)
[![Telegram](https://img.shields.io/badge/Follow-Telegram-blue.svg?logo=telegram)](https://t.me/YukiHookAPI)
<br/><br/>
<img src="https://github.com/fankes/YuKiHookAPI/blob/master/img-src/icon.png?raw=true" width = "100" height = "100"/>
<br/>
<br/>
帮助你快速创建一个使用 YukiHookAPI 打造的 Xposed 项目模板。
<br/>

[English](https://github.com/fankes/YukiHookAPI-ProjectBuilder/blob/master/README.md) | 简体中文

## 这是什么

- 这是一个使用 [YukiHookAPI](https://github.com/fankes/YukiHookAPI) 作为核心的 Xposed 模块自动构建工具

- 实现自动化搜索依赖快速搭建一个包含 Xposed 模块环境的 Android 项目模板

## 如何使用

- 本项目使用 **Electron** 开发，快速实现多平台本地化应用程序的构建和运行

你可以直接从 [Release](https://github.com/fankes/YukiHookAPI-ProjectBuilder/releases) 下载适合于你平台的应用程序。

**以下是手动部署与编译步骤**

首先你需要安装 [node.js](https://nodejs.org/zh-cn/)

IDE 工具建议使用 **IntelliJ IDEA** 或 **WebStorm**

不建议使用 **Visual Studio Code** 对代码进行格式化，可能会造成一些错误。

- 执行如下命令安装 Electron

```
npm install --save-dev electron
```

- 执行如下命令安装 yarn

```
npm install yarn
```

- 进入项目目录，执行如下命令安装依赖

```
npm install --save-dev @electron-forge/cli
```

```
npx electron-forge import
```

- 使用如下命令进行调试

```
npm run start
```

- 使用如下命令进行编译 & 打包

**Linux/macOS**

```
npm run make
```

**Windows**

```
npm run package
```

## 许可证

- [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)

```
Copyright (C) 2019-2023 HighCapable

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```

版权所有 © 2019-2023 HighCapable