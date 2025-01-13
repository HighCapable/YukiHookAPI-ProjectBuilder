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
 * This file is Created by fankes on 2022/7/14.
 */

const dayjs = require('dayjs');

/**
 * 日期时间命名空间
 */
const dateTime = {
    /**
     * 获取当前 CST 时间
     * @return string
     */
    cstTime: () => {
        const today = dayjs(new Date());
        let week = '';
        switch (today.day()) {
            case 0:
                week = 'Sun';
                break;
            case 1:
                week = 'Mon';
                break;
            case 2:
                week = 'Tue';
                break;
            case 3:
                week = 'Wed';
                break;
            case 4:
                week = 'Thu';
                break;
            case 5:
                week = 'Fri';
                break;
            case 6:
                week = 'Sat';
                break;
        }
        return week + today.format(' MMM DD HH:mm:ss CST YYYY');
    }
}

module.exports = {dateTime};