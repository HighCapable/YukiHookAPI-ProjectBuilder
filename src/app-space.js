/*
 * YukiHookAPI Project Builder - A Xposed Project Builder by YukiHookAPI.
 * Copyright (C) 2019-2024 HighCapable
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
 * This file is Created by fankes on 2022/7/21.
 */

const {app, ipcMain, dialog, BrowserWindow, Menu, MenuItem} = require('electron');
const {locale} = require('./libs/locale');
const {fileSystem} = require('./libs/file-system');
const {store} = require('./libs/store');
const {system} = require("./libs/system");

/** 主窗口 */
let mainWindow = null;

/**
 * 应用程序初始化命名空间
 */
const appSpace = {
    /** 开始装载窗口 */
    loadFrame: () => {
        appSpace.createWindow();
        appSpace.createMenu();
    },
    /** 创建窗口 */
    createWindow: () => {
        mainWindow = new BrowserWindow({
            title: locale.i18n.windowTitle,
            width: 1000,
            height: 1050,
            resizable: false,
            maximizable: false,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });
        mainWindow.loadFile('src/content/index.html').then(() => {
            appWindow.webContents.methods.page.init(localeConfig.currentLocale(), app.getVersion());
        });
        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
        });
    },
    /** 创建菜单 */
    createMenu: () => {
        const menu = new Menu();
        const separatorItem = new MenuItem({type: 'separator'});
        const aboutChildItem = new MenuItem({
            label: locale.i18n.about,
            accelerator: system.isMacOS ? 'command+a' : 'ctrl+a',
            click: () => {
                appWindow.webContents.methods.page.showAbout(app.getName(), app.getVersion());
            }
        });
        const checkUpdateChildItem = new MenuItem({
            label: locale.i18n.checkUpdate,
            click: () => {
                appWindow.webContents.methods.page.checkForUpdates();
            }
        });
        const projectAddressChildItem = new MenuItem({
            label: locale.i18n.projectAddress,
            accelerator: system.isMacOS ? 'command+w' : 'ctrl+w',
            click: () => {
                system.openBrowser('https://github.com/HighCapable/YuKiHookAPI');
            }
        });
        const helpDocumentationChildItem = new MenuItem({
            label: locale.i18n.helpDocumentation,
            accelerator: system.isMacOS ? 'command+h' : 'ctrl+h',
            click: () => {
                system.openBrowser('https://highcapable.github.io/YukiHookAPI');
            }
        });
        const openSourceChildItem = new MenuItem({
            label: locale.i18n.openSource,
            accelerator: system.isMacOS ? 'command+o' : 'ctrl+o',
            click: () => {
                appWindow.webContents.methods.page.showOpenSource();
            }
        });
        const laguageSubChildItems = [];
        laguageSubChildItems.push(new MenuItem({
            type: 'radio',
            label: locale.i18n.followSystem,
            checked: localeConfig.isFollowSystem,
            click: () => {
                localeConfig.changeLocale();
            }
        }));
        for (const la in locale.languageSupports)
            laguageSubChildItems.push(new MenuItem({
                type: 'radio',
                label: locale.languageSupports[la],
                checked: la === locale.name && !localeConfig.isFollowSystem,
                click: () => {
                    localeConfig.changeLocale(la);
                }
            }));
        const languageChildItem = new MenuItem({
            label: locale.i18n.language + ' (Language)',
            submenu: laguageSubChildItems
        });
        const quitChildItem = new MenuItem({
            label: locale.i18n.quit,
            accelerator: system.isMacOS ? 'command+q' : 'ctrl+q',
            click: () => {
                app.quit();
            }
        });
        const runBuildChildItem = new MenuItem({
            label: locale.i18n.runBuild,
            accelerator: system.isMacOS ? 'command+b' : 'ctrl+b',
            click: () => {
                appWindow.webContents.methods.build.checking();
            }
        });
        const newTemplateChildItem = new MenuItem({
            label: locale.i18n.newTemplate,
            accelerator: system.isMacOS ? 'command+n' : 'ctrl+n',
            click: () => {
                appWindow.webContents.methods.configTemplate.createNew();
            }
        });
        const templateSubChildItems = [];
        const clearAllTemplateChildItem = new MenuItem({
            label: locale.i18n.clearAllTemplate,
            accelerator: system.isMacOS ? 'command+d' : 'ctrl+d',
            click: () => {
                appWindow.webContents.methods.configTemplate.clearAll();
            }
        });
        const templates = store.get('config-templates', []);
        if (templates.length > 0) {
            templates.forEach((value) => {
                templateSubChildItems.push(new MenuItem({
                    label: value.name,
                    click: () => {
                        appWindow.webContents.methods.configTemplate.load(value);
                    }
                }));
            });
            templateSubChildItems.push(separatorItem);
            templateSubChildItems.push(clearAllTemplateChildItem);
        } else templateSubChildItems.push(new MenuItem({
            label: locale.i18n.nothing,
            enabled: false
        }));
        const savedTemplateChildItem = new MenuItem({
            label: locale.i18n.savedTemplate,
            submenu: templateSubChildItems
        });
        const configTemplateChildItem = new MenuItem({
            label: locale.i18n.configTemplate,
            submenu: [newTemplateChildItem, savedTemplateChildItem]
        });
        const resetCurrentConfigChildItem = new MenuItem({
            label: locale.i18n.resetCurrentConfig,
            accelerator: system.isMacOS ? 'command+r' : 'ctrl+r',
            click: () => {
                appWindow.webContents.methods.page.restore();
            }
        });
        const fileMainItem = new MenuItem({
            label: system.isMacOS ? app.name : locale.i18n.file,
            submenu: system.isMacOS ? [aboutChildItem, separatorItem, checkUpdateChildItem, separatorItem,
                projectAddressChildItem, helpDocumentationChildItem, separatorItem, openSourceChildItem, separatorItem,
                languageChildItem, separatorItem, quitChildItem] : [languageChildItem, separatorItem, quitChildItem]
        });
        const projectMainItem = new MenuItem({
            label: locale.i18n.project,
            submenu: [runBuildChildItem, separatorItem, configTemplateChildItem, resetCurrentConfigChildItem]
        });
        const helpMainItem = new MenuItem({
            label: (locale.i18n.help),
            submenu: [aboutChildItem, separatorItem, checkUpdateChildItem, separatorItem,
                projectAddressChildItem, helpDocumentationChildItem, separatorItem, openSourceChildItem]
        });
        menu.append(fileMainItem);
        menu.append(projectMainItem);
        if (!system.isMacOS) menu.append(helpMainItem);
        Menu.setApplicationMenu(menu);
    },
    /**
     * 注册 ipc 监听
     * @param option 回调选项
     */
    registerIpcListener: (option) => {
        ipcMain.on('run-packaging-project', (_, configs) => {
            option['run-packaging-project'](configs);
        });
        ipcMain.on('open-complete-project', () => {
            option['open-complete-project']();
        });
        ipcMain.on('save-config-template', (_, configs) => {
            const templates = store.get('config-templates', []);
            templates.push(configs);
            store.set('config-templates', templates);
            appSpace.createMenu();
        });
        ipcMain.on('clear-all-config-template', () => {
            store.set('config-templates', []);
            appSpace.createMenu();
        });
        ipcMain.on('reload-current-page', () => {
            setTimeout(() => {
                mainWindow.reload();
                appWindow.webContents.methods.page.init(localeConfig.currentLocale(), app.getVersion());
            }, 150);
        });
        ipcMain.on('relaunch-app', () => {
            mainWindow.close();
            app.relaunch();
        });
        ipcMain.on('open-system-browser', (_, url) => {
            system.openBrowser(url);
        });
    }
};

/**
 * 应用程序配置命名空间
 */
const appConfig = {
    /**
     * 项目根路径
     * @return string
     */
    sourcePath: app.isPackaged ? app.getAppPath() : '.',
    /**
     * 项目外部路径
     * @return string
     */
    dataPath: fileSystem.path(app.getPath('appData'), 'YukiHookAPI'),
    /** 创建应用数据目录 */
    createDataDir: () => {
        const dataPath = appConfig.dataPath;
        if (!fileSystem.exists(dataPath)) fileSystem.mkdir(dataPath);
    }
};

/**
 * 语言区域配置命名空间
 */
const localeConfig = {
    /**
     * 语言是否跟随系统
     * @return boolean
     */
    isFollowSystem: store.get('locale-follow-system', true),
    /**
     * 当前存储的语言名称
     * @return string
     */
    storeLocaleName: store.get('store-locale-name', locale.default),
    /**
     * 获取当前语言区域名称
     * @return string
     */
    currentLocale: () => {
        return localeConfig.isFollowSystem ? app.getLocale() : localeConfig.storeLocaleName;
    },
    /**
     * 修改语言
     * @param name 语言名称
     */
    changeLocale: (name = 'default') => {
        if (name === 'default') {
            store.set('locale-follow-system', true);
            store.set('store-locale-name', locale.default);
        } else {
            store.set('locale-follow-system', false);
            store.set('store-locale-name', name);
        }
        appWindow.webContents.methods.page.relaunch();
    }
};

/**
 * 应用程序窗口命名空间
 */
const appWindow = {
    /**
     * 打开目录
     * @param option 选项
     * @param callback 回调结果
     * @param onError 回调错误
     */
    showOpenDirectory: (option, callback, onError) => {
        dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
            title: option['title'],
            message: option['message'],
            buttonLabel: option['buttonLabel']
        }).then(result => {
            callback(result);
        }).catch((e) => {
            onError(e);
        });
    },
    /** 窗口内网页交互调用桥 */
    webContents: {
        /**
         * 执行内部 JS
         * @param code 执行代码
         */
        execJs: (code) => {
            mainWindow.webContents.executeJavaScript(code).then(() => null);
        },
        methods: {
            configTemplate: {
                load: (configs) => {
                    appWindow.webContents.execJs('configTemplate.load(\'' + encodeURI(JSON.stringify(configs)) + '\')');
                },
                createNew: () => {
                    appWindow.webContents.execJs('configTemplate.createNew()');
                },
                clearAll: () => {
                    appWindow.webContents.execJs('configTemplate.clearAll()');
                }
            },
            page: {
                init: (localeName, appVersion) => {
                    appWindow.webContents.execJs('page.init(\'' + localeName + '\',\'' + appVersion + '\')');
                },
                snack: (message) => {
                    appWindow.webContents.execJs('page.snack(\'' + message + '\')');
                },
                showAbout: (name, version) => {
                    appWindow.webContents.execJs('page.showAbout(\'' + name + '\',\'' + version + '\')');
                },
                showOpenSource: () => {
                    appWindow.webContents.execJs('page.showOpenSource()');
                },
                checkForUpdates: () => {
                    appWindow.webContents.execJs('page.checkForUpdates()');
                },
                restore: () => {
                    appWindow.webContents.execJs('page.restore()');
                },
                relaunch: () => {
                    appWindow.webContents.execJs('page.relaunch()');
                }
            },
            build: {
                checking: () => {
                    appWindow.webContents.execJs('build.checking()');
                },
                changeStatus: (msg) => {
                    appWindow.webContents.execJs('build.changeStatus(\'' + msg + '\')');
                },
                complete: (msg) => {
                    appWindow.webContents.execJs('build.complete(\'' + msg + '\')');
                },
                failure: (msg) => {
                    appWindow.webContents.execJs('build.failure(\'' + msg + '\')');
                },
                cancel: () => {
                    appWindow.webContents.execJs('build.cancel()');
                }
            }
        }
    }
};

module.exports = {appSpace, appWindow, appConfig, localeConfig};