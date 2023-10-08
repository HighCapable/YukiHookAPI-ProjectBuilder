# YukiHookAPI Project Builder

[![GitHub license](https://img.shields.io/github/license/HighCapable/YukiHookAPI-ProjectBuilder?color=blue)](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/HighCapable/YukiHookAPI-ProjectBuilder?display_name=release&logo=github&color=green)](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/releases)
[![Telegram](https://img.shields.io/badge/discussion-Telegram-blue.svg?logo=telegram)](https://t.me/YukiHookAPI)
[![Telegram](https://img.shields.io/badge/discussion%20dev-Telegram-blue.svg?logo=telegram)](https://t.me/HighCapable_Dev)

<img src="https://github.com/HighCapable/YuKiHookAPI/blob/master/img-src/icon.png?raw=true" width = "100" height = "100" alt="LOGO"/>

帮助你快速创建一个使用 YukiHookAPI 打造的 Xposed 项目模板。

[English](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/blob/master/README.md) | 简体中文

## 项目迁移公告

这个项目最终的目的就是创建一个新的 Android Studio/IDEA 项目模版，然后再在对应的 IDE 中打开项目。

这种方式不是很优雅，而且需要在用户的电脑上安装这个软件，后期我准备将这个项目合并到 IDEA 插件中，集成到新项目模版功能里。

这样一来，使用 IDEA 安装插件即可实现直接使用此模版创建项目的功能，而且更加灵活和具有可拓展性。

在新的项目确定后，会在这里添加新项目的链接，届时我会终止维护这个项目并建议大家转移到新项目。

## 这是什么

这是一个使用 [YukiHookAPI](https://github.com/HighCapable/YuKiHookAPI) 作为核心的 Xposed 模块自动构建工具。

实现自动化搜索依赖快速搭建一个包含 Xposed 模块环境的 Android 项目模板。

## 如何使用

本项目使用 **Electron** 开发，快速实现多平台本地化应用程序的构建和运行。

你可以直接从 [Release](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/releases) 下载适合于你平台的应用程序。

> 以下是手动部署与编译步骤

首先你需要安装 [node.js](https://nodejs.org/zh-cn/)

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

## 捐赠支持

工作不易，无意外情况此项目将继续维护下去，提供更多可能，欢迎打赏。

<img src="https://github.com/fankes/fankes/blob/main/img-src/payment_code.jpg?raw=true" width = "500" alt="Payment Code"/>

## Star History

![Star History Chart](https://api.star-history.com/svg?repos=HighCapable/YukiHookAPI-ProjectBuilder&type=Date)

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