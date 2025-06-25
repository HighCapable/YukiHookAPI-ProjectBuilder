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

This project belongs to the above-mentioned organization, **click the link above to follow this organization** and discover more good projects.

## Project Migration Notice

The ultimate goal of this project is to create a new Android Studio/IDEA project template, and then open the project in the corresponding IDE.

This method is not very elegant and requires the software to be installed on the user's computer.

Later, I plan to merge this project into the IDEA plugin and integrate it into the new project template function.

In this way, you can use IDEA to install the plugin to create projects directly using this template, and it is more flexible and scalable.

After the new project is determined, a link to the new project will be added here.

At that time, I will terminate the maintenance of this project and recommend that everyone move to the new project.

**The project builder will be maintained before the release of the first `2.0.0` version of `YukiHookAPI`. This project will be officially deprecated
after the new version is released.**

## What's this

This is an automatic building tool for Xposed Modules using [YukiHookAPI](https://github.com/HighCapable/YuKiHookAPI) as the core.

Implementing automated search relies on quickly building an Android project template that includes a Xposed Module environment.

## How to use

This project is developed using **Electron** to quickly build and run multi-platform localized applications.

You can download the application for your platform directly
from [Release](https://github.com/HighCapable/YukiHookAPI-ProjectBuilder/releases).

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

## Promotion

<!--suppress HtmlDeprecatedAttribute -->
<div align="center">
     <h2>Hey, please stay! 👋</h2>
     <h3>Here are related projects such as Android development tools, UI design, Gradle plugins, Xposed Modules and practical software. </h3>
     <h3>If the project below can help you, please give me a star! </h3>
     <h3>All projects are free, open source, and follow the corresponding open source license agreement. </h3>
     <h1><a href="https://github.com/fankes/fankes/blob/main/project-promote/README.md">→ To see more about my projects, please click here ←</a></h1>
</div>

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