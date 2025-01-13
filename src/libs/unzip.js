/*
 * YukiHookAPI Project Builder - A Xposed Project Builder by YukiHookAPI.
 * Copyright (C) 2019 HighCapable
 * https://github.com/HighCapable/YukiHookAPI-ProjectBuilder
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
 * This file is Created by fankes on 2022/7/12.
 */

const DecompressZip = require('decompress-zip');

/**
 * 解压缩命名空间
 */
const unzip = {
    /** 当前实例 */
    instance: null,
    /**
     * 解压目标文件
     * @param filePath 压缩文件路径
     * @param outPath 解压目录
     */
    extract: (filePath, outPath) => {
        unzip.instance = new DecompressZip(filePath);
        unzip.instance.extract({path: outPath});
    },
    /**
     * 监听解压进度
     * @param callback 回调
     */
    progress: (callback) => {
        unzip.instance.on('progress', callback);
    },
    /**
     * 监听解压成功
     * @param callback 回调
     */
    success: (callback) => {
        unzip.instance.on('extract', callback);
    },
    /**
     * 监听解压失败
     * @param callback 回调
     */
    failure: (callback) => {
        unzip.instance.on('error', callback);
    }
};

module.exports = {unzip};