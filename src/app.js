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
 * This file is Created by fankes on 2022/7/5.
 */

const {app} = require('electron');
const {locale} = require('./libs/locale');
const {appSpace, appConfig, localeConfig} = require('./app-space');
const {transaction} = require('./transaction');

/** 忽略跨域访问警告 */
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

/** 当应用程序启动时完成创建 */
app.whenReady().then(() => {
    appConfig.createDataDir();
    locale.initLocale(localeConfig.currentLocale());
    app.setName(locale.i18n.appName);
    appSpace.loadFrame();
    appSpace.registerIpcListener({
        ['run-packaging-project']: (configs) => {
            transaction.start(configs);
        },
        ['open-complete-project']: () => {
            transaction.openProject();
        }
    });
}).catch((e) => {
    console.log('[Warning] An error occurred during app startup ↓\n' + e);
});