/*
 * YukiHookAPI Project Builder - A Xposed Project Builder by YukiHookAPI.
 * Copyright (C) 2019-2022 HighCapable
 * https://github.com/fankes/YukiHookAPI-ProjectBuilder
 *
 * This software is non-free but opensource software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * and eula along with this software.  If not, see
 * <https://www.gnu.org/licenses/>
 *
 * This file is Created by fankes on 2022/7/15.
 */

const {shell} = require('electron');
const {exec} = require('child_process');

/**
 * 系统操作命名空间
 */
const system = {
    /**
     * 是否为 macOS
     * @return boolean
     */
    isMacOS: process.platform === 'darwin',
    /**
     * 打开系统默认浏览器
     * @param url 地址
     */
    openBrowser: (url) => {
        switch (process.platform) {
            case 'darwin':
                exec('open ' + url);
                break;
            case 'win32':
                exec('start ' + url);
                break;
            default:
                exec('xdg-open', [url]);
                break;
        }
    },
    /**
     * 打开资源文件管理器/访达
     * @param path 文件路径
     */
    openExplorer: (path) => {
        shell.openPath(path).then(() => null);
    }
};

module.exports = {system};