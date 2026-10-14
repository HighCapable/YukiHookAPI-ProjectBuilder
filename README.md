# YukiHookAPI Project Builder

[![GitHub license](https://img.shields.io/github/license/HighCapable/YukiHookAPI-ProjectBuilder?color=blue&style=flat-square)](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/HighCapable/YukiHookAPI-ProjectBuilder?display_name=release&logo=github&color=green&style=flat-square)](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/releases)
[![Telegram](https://img.shields.io/badge/discussion-Telegram-blue.svg?logo=telegram&style=flat-square)](https://t.me/YukiHookAPI)
[![Telegram](https://img.shields.io/badge/discussion%20dev-Telegram-blue.svg?logo=telegram&style=flat-square)](https://t.me/HighCapable_Dev)
[![QQ](https://img.shields.io/badge/discussion%20dev-QQ-blue.svg?logo=tencent-qq&logoColor=red&style=flat-square)](https://qm.qq.com/cgi-bin/qm/qr?k=Pnsc5RY6N2mBKFjOLPiYldbAbprAU3V7&jump_from=webapi&authKey=X5EsOVzLXt1dRunge8ryTxDRrh9/IiW1Pua75eDLh9RE3KXE+bwXIYF5cWri/9lf)

<img src="img-src/icon.png" width = "100" height = "100" alt="LOGO"/>

A Xposed Project Builder by YukiHookAPI.

English | [简体中文](README-zh-CN.md)

| <img src="https://github.com/HighCapable/.github/blob/main/img-src/logo.jpg?raw=true" width = "30" height = "30" alt="LOGO"/> | [HighCapable](https://github.com/HighCapable) |
|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|

This project belongs to the organization above. **Click the link to follow us** and discover more awesome projects.

## 🚨 Maintenance of this project has been stopped

With architectural adjustments to the main project YukiHook, along with rapid iterations and compatibility issues of AGP, the original value of this
project has disappeared. It will no longer be maintained and has been deprecated, and plans for the IDE plugin have also been terminated. We recommend
that you manually create a standard Android project template using Android Studio and import YukiHook for use.

Much of the code in this project may have black-box issues arising from immature architectural design in its early stages. It is for learning and
reference only, please do not use it in production projects.

## What's this

This is an automatic building tool for Xposed Modules using [YukiHookAPI](https://github.com/HighCapable/YuKiHookAPI) as the core.

Implementing automated search relies on quickly building an Android project template that includes a Xposed Module environment.

## How to use

This project is developed using **Electron** to quickly build and run multi-platform localized applications.

You can download the application for your platform directly from [Release](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/releases).

> The following are the manual deployment and compilation steps

First you need to install [node.js](https://nodejs.org/en/)

IDE tools recommend **IntelliJ IDEA** or **WebStorm**.

Formatting code with **Visual Studio Code** is not recommended and may cause some errors.

Execute the following command to install Electron.

```
npm install --save-dev electron
```

Execute the following command to install yarn.

```
npm install yarn
```

Enter the project directory and execute the following command to install dependencies.

```
npm install --save-dev @electron-forge/cli
```

```
npx electron-forge import
```

Use the following command to debug.

```
npm run start
```

Use the following commands to compile & package.

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

## License

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

Copyright © 2019 HighCapable