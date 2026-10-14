# YukiHookAPI Project Builder

[![GitHub license](https://img.shields.io/github/license/HighCapable/YukiHookAPI-ProjectBuilder?color=blue&style=flat-square)](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/HighCapable/YukiHookAPI-ProjectBuilder?display_name=release&logo=github&color=green&style=flat-square)](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/releases)
[![Telegram](https://img.shields.io/badge/discussion-Telegram-blue.svg?logo=telegram&style=flat-square)](https://t.me/YukiHookAPI)
[![Telegram](https://img.shields.io/badge/discussion%20dev-Telegram-blue.svg?logo=telegram&style=flat-square)](https://t.me/HighCapable_Dev)
[![QQ](https://img.shields.io/badge/discussion%20dev-QQ-blue.svg?logo=tencent-qq&logoColor=red&style=flat-square)](https://qm.qq.com/cgi-bin/qm/qr?k=Pnsc5RY6N2mBKFjOLPiYldbAbprAU3V7&jump_from=webapi&authKey=X5EsOVzLXt1dRunge8ryTxDRrh9/IiW1Pua75eDLh9RE3KXE+bwXIYF5cWri/9lf)

<img src="img-src/icon.png" width = "100" height = "100" alt="LOGO"/>

帮助你快速创建一个使用 YukiHookAPI 打造的 Xposed 项目模板。

[English](README.md) | 简体中文

| <img src="https://github.com/HighCapable/.github/blob/main/img-src/logo.jpg?raw=true" width = "30" height = "30" alt="LOGO"/> | [HighCapable](https://github.com/HighCapable) |
|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|

这个项目属于上述组织， **点击上方链接关注这个组织**，发现更多好项目。

## 🚨 此项目已停止维护

随着主项目 YukiHook 的架构调整和 AGP 的快速迭代和兼容性问题，这个项目的最初价值已经消失，将不再维护并被弃用，IDE 插件的计划也已终止，我们建议你手动使用
Android Studio 创建标准的 Android 项目模板并引入 YukiHook 进行使用。

这个项目很多代码可能存在早年架构设计不成熟产生的黑盒问题，仅供学习参考，请勿再投入生产项目中使用。

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

## Star History

![Star History Chart](https://api.star-history.com/svg?repos=HighCapable/YukiHookAPI-ProjectBuilder&type=Date)

## 许可证

- [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)

```
Copyright (C) 2019 HighCapable

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

版权所有 © 2019 HighCapable