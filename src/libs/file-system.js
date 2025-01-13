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

const fs = require('fs');
const fse = require('fs-extra');

/**
 * 文件系统命名空间
 */
const fileSystem = {
    /**
     * 文件分隔符
     * @return string
     */
    separator: process.platform === 'win32' ? '\\' : '/',
    /**
     * 自动拼接字符串到路径
     * @param names 文件、目录名数组 - 可传入子数组
     * @return string
     */
    path: (...names) => {
        if (names.length <= 0) return '';
        let path = '';
        names.forEach((value) => {
            if (value instanceof Array) value.forEach((value) => {
                path = path.concat(value, fileSystem.separator);
            }); else path = path.concat(value, fileSystem.separator);
        });
        path = path.substring(0, path.lastIndexOf(fileSystem.separator));
        return path;
    },
    /**
     * 是否为文件
     * @param path 文件、目录路径
     * @return boolean
     */
    isFile: (path) => fs.lstatSync(path).isFile(),
    /**
     * 是否为目录
     * @param path 文件、目录路径
     * @return boolean
     */
    isDirectory: (path) => fs.lstatSync(path).isDirectory(),
    /**
     * 判断文件、目录是否存在
     * @param paths 文件、目录路径数组
     * @return boolean
     */
    exists: (...paths) => {
        if (paths.length < 0) return false;
        let isExists = true;
        paths.forEach((value) => {
            isExists &= fs.existsSync(value);
        });
        return isExists;
    },
    /**
     * 创建单层目录
     * @param path 预期目录路径
     * @param callback 回调结果
     */
    mkdir: (path, callback) => {
        fs.mkdir(path, callback ?? (() => null));
    },
    /**
     * 删除文件或目录
     * @param path 文件、目录路径
     * @param callback 回调结果
     */
    delete: (path, callback) => {
        if (!fileSystem.exists(path)) return;
        if (fileSystem.isDirectory(path))
            fs.rm(path, {recursive: true}, callback ?? (() => null));
        else fs.unlink(path, callback ?? (() => null));
    },
    /**
     * 删除多个文件或目录
     * @param callback 全部完成后回调结果
     * @param paths 文件、目录路径数组
     */
    deletes: (callback, ...paths) => {
        if (paths.length <= 0) return;
        let index = 0;

        /** 递归所有路径 */
        function recursion() {
            fileSystem.delete(paths[index], () => {
                if (index < paths.length - 1) {
                    index++;
                    recursion();
                } else callback();
            });
        }

        recursion();
    },
    /**
     * 复制文件 (不能复制目录)
     * @param fromPath 原始路径
     * @param toPath 目标路径
     * @param callback 复制结束回调
     */
    copy: (fromPath, toPath, callback) => {
        if (fileSystem.isFile(fromPath))
            fs.copyFile(fromPath, toPath, callback ?? (() => null));
        else fse.copy(fromPath, toPath, {recursive: true}, callback ?? (() => null));
    },
    /**
     * 重命名文件、目录
     * @param path 文件、目录路径
     * @param oldName 原名称
     * @param newName 新名称
     * @param callback 回调结果
     */
    rename: (path, oldName, newName, callback) => {
        fs.rename(path, path.replace(oldName, newName), callback ?? (() => null));
    },
    /**
     * 读取文件
     * @param path 文件路径
     * @param callback 回调文件内容
     */
    read: (path, callback) => {
        fs.readFile(path, (_, buffer) => {
            callback(buffer.toString());
        });
    },
    /**
     * 写入文件
     * @param path 文件路径
     * @param content 文件内容
     * @param callback 回调结果
     */
    write: (path, content, callback) => {
        fs.writeFile(path, content, callback ?? (() => null));
    },
    /**
     * 替换写入文件
     * @param path 文件路径
     * @param param 替换内容
     * @param callback 回调结果
     */
    replace: (path, param, callback) => {
        fileSystem.read(path, (content) => {
            let finalContent = content;
            param.forEach((value) => {
                while (finalContent.indexOf(value['placeholder']) > 0)
                    finalContent = finalContent.replace(value['placeholder'], value['value']);
            });
            fileSystem.write(path, finalContent, callback ?? (() => null));
        });
    },
    /**
     * 替换写入当前目录下全部文件
     * @param path 目录路径
     * @param filters 文件类型筛选数组
     * @param param 替换内容
     * @param callback 全部完成后回调结果
     */
    replaces: (path, filters, param, callback) => {
        /**
         * 递归所有目录
         * @param path 路径
         */
        function recursion(path) {
            fs.readdir(path, (_, paths) => {
                if (paths.length > 0)
                    paths.forEach((value) => {
                        const finalPath = fileSystem.path(path, value);
                        if (fileSystem.isDirectory(finalPath)) recursion(finalPath);
                        else if (filters.find(e => value.endsWith(e))) fileSystem.replace(finalPath, param);
                    });
            });
        }

        recursion(path);
        /**
         * 递归最长等待 1.5 秒执行下一步
         * FIXME 递归无法大概估算出其目录层次深度全部循环完毕后回调的结果 - 有待优化
         */
        setTimeout(() => {
            callback();
        }, 1500);
    }
};

module.exports = {fileSystem};