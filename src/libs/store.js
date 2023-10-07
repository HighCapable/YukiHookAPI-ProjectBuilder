/*
 * YukiHookAPI Project Builder - A Xposed Project Builder by YukiHookAPI.
 * Copyright (C) 2019-2023 HighCapable
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
 * This file is Created by fankes on 2022/7/14.
 */

const Store = require('electron-store');

/** Key-Value 存储对象 */
const store = {
    /** 当前实例 */
    instance: undefined,
    /**
     * 获取数据
     * @param key 键值名称
     * @param value 默认值
     * @return
     */
    get: (key, value) => {
        store.instance ??= new Store();
        return store.instance.get(key, value);
    },
    /**
     * 写入数据
     * @param key 键值名称
     * @param value 键值内容
     */
    set: (key, value) => {
        store.instance ??= new Store();
        store.instance.set(key, value);
    }
};

module.exports = {store};