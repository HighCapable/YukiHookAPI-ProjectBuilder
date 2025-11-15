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
 * This file is Created by fankes on 2022/7/21.
 */

const {system} = require('./libs/system');
const {locale} = require('./libs/locale');
const {fileSystem} = require('./libs/file-system');
const {unzip} = require('./libs/unzip');
const {dateTime} = require('./libs/date-time');
const {appWindow, appConfig} = require('./app-space');

/**
 * 创建项目事务命名空间
 */
const transaction = {
    /** 项目模板名称 */
    templateName: 'project-template',
    /** 当前项目创建路径 */
    projectPath: '',
    /** 打开已创建的项目 */
    openProject: () => {
        system.openExplorer(transaction.projectPath);
    },
    /**
     * 开始任务
     * @param configs 项目配置
     */
    start: (configs) => {
        appWindow.showOpenDirectory({
            title: locale.i18n.selectProjectPath,
            message: locale.i18n.selectProjectPathTip,
            buttonLabel: locale.i18n.selectThisDirectory
        }, (result) => {
            if (!result.canceled) {
                transaction.projectPath = fileSystem.path(result.filePaths[0], configs.basicConfig.projectName);
                if (!fileSystem.exists(transaction.projectPath)) {
                    const ossPath = fileSystem.path(appConfig.sourcePath, 'public', transaction.templateName.concat('.zip'));
                    const outPath = fileSystem.path(appConfig.dataPath, transaction.templateName.concat('.zip'));
                    const targetPath = fileSystem.path(appConfig.dataPath, transaction.templateName);
                    if (fileSystem.exists(ossPath))
                        if (fileSystem.exists(targetPath))
                            fileSystem.delete(targetPath, () => {
                                transaction.packaing(configs, ossPath, outPath, targetPath);
                            });
                        else transaction.packaing(configs, ossPath, outPath, targetPath);
                    else appWindow.webContents.methods.build.failure(locale.i18n.buildDependProblemTip);
                } else appWindow.webContents.methods.build.failure(locale.i18n.fileAlreadyExistsTip);
            } else appWindow.webContents.methods.build.cancel();
        }, () => {
            appWindow.webContents.methods.page.snack(locale.i18n.somethingWentWrongTip);
        });
    },
    /**
     * 开始打包
     * @param configs 项目配置
     * @param ossPath 原始路径 (应用程序内部路径)
     * @param outPath 导出路径 (外部数据临时路径)
     * @param targetPath 目标路径 (解包打包操作路径)
     */
    packaing: (configs, ossPath, outPath, targetPath) => {

        /**
         * 代码文件模板命名空间
         */
        const codeFiles = {
            /**
             * 获取代码缩进空格
             * @param count 空格个数
             * @return string
             */
            space: (count) => {
                let space = '';
                for (let i = 1; i <= count; i++) space = space.concat(' ');
                return space;
            },
            /**
             * 插入代码
             * @param origCode 原始代码
             * @param newCodes 新的代码数组
             * @return string
             */
            append: (origCode, ...newCodes) => {
                if (newCodes.length <= 0) return;
                let finalCode = origCode;
                newCodes.forEach((value) => {
                    if (value !== '') finalCode = finalCode.concat(value, '\n', codeFiles.space(8));
                });
                return finalCode;
            },
            'AndroidManifest.xml': {
                newXSharePrefs: (isEnabled) => ('<meta-data\n' +
                    codeFiles.space(12) + 'android:name="xposedsharedprefs"\n' +
                    codeFiles.space(12) + 'android:value="' + (isEnabled ? 'true' : 'false') + '" />'),
                xposedModule: () => ('<meta-data\n' +
                    codeFiles.space(12) + 'android:name="xposedmodule"\n' +
                    codeFiles.space(12) + 'android:value="true" />'),
                moduleScope: () => ('<meta-data\n' +
                    codeFiles.space(12) + 'android:name="xposedscope"\n' +
                    codeFiles.space(12) + 'android:resource="@array/module_scope" />')
            },
            'array.xml': {
                item: (name) => '<item>' + name + '</item>'
            },
            'HookEntry.kt': {
                annotations: {
                    entryClassName: (name) => 'entryClassName = "' + name + '"',
                    supportResourcesHook: (isEnabled) => 'isUsingResourcesHook = ' + (isEnabled ? 'true' : 'false'),
                    supportXposedModuleStatus: (isEnabled) => 'isUsingXposedModuleStatus = ' + (isEnabled ? 'true' : 'false')
                },
                configs: {
                    debugLog: {
                        tagName: (name) => 'tag = "' + name + '"',
                        enable: (isEnabled) => 'isEnable = ' + (isEnabled ? 'true' : 'false')
                    },
                    enableDebug: (isEnabled) => 'isDebug = ' + (isEnabled ? 'true' : 'false'),
                    enableResourcesCache: (isEnabled) => 'isEnableModuleAppResourcesCache = ' + (isEnabled ? 'true' : 'false'),
                    enableYChannel: (isEnabled) => 'isEnableDataChannel = ' + (isEnabled ? 'true' : 'false')
                }
            },
            'MainActivity.kt': {
                isModuleActive: () => 'YukiHookAPI.Status.isModuleActive',
                isXposedModuleActive: () => 'YukiHookAPI.Status.isXposedModuleActive',
                isTaiChiModuleActive: () => 'YukiHookAPI.Status.isTaiChiModuleActive'
            }
        };

        /**
         * 更新创建进度显示
         * @param progress 当前进度
         */
        function changeProgress(progress) {
            appWindow.webContents.methods.build.changeStatus(locale.format(locale.i18n.packagingAndBuildingTip, progress, 4));
        }

        /** 结束创建项目 */
        function finishBuild() {
            changeProgress(4);
            fileSystem.copy(targetPath, transaction.projectPath, () => {
                if (fileSystem.exists(transaction.projectPath))
                    fileSystem.deletes(() => {
                        transaction.finish(configs);
                    }, outPath, targetPath);
                else appWindow.webContents.methods.build.failure(locale.i18n.readOnlyFileSystemTip);
            });
        }

        /** 移动项目代码到包名目录 */
        function moveToPackageName() {
            changeProgress(3);
            const folderNames = configs.basicConfig.packageName.split('.');
            const androidTestSpPath = fileSystem.path(targetPath, 'app', 'src', 'androidTest', 'java', 'scope');
            const androidTestPath = fileSystem.path(targetPath, 'app', 'src', 'androidTest', 'java', folderNames);
            const testSpPath = fileSystem.path(targetPath, 'app', 'src', 'test', 'java', 'scope');
            const testPath = fileSystem.path(targetPath, 'app', 'src', 'test', 'java', folderNames);
            const mainSpPath = fileSystem.path(targetPath, 'app', 'src', 'main', 'java', 'scope');
            const mainPath = fileSystem.path(targetPath, 'app', 'src', 'main', 'java', folderNames);
            if (fileSystem.exists(androidTestSpPath, testSpPath, mainSpPath))
                fileSystem.copy(androidTestSpPath, androidTestPath, () => {
                    fileSystem.copy(testSpPath, testPath, () => {
                        fileSystem.copy(mainSpPath, mainPath, () => {
                            fileSystem.deletes(() => {
                                finishBuild();
                            }, androidTestSpPath, testSpPath, mainSpPath);
                        });
                    });
                });
            else appWindow.webContents.methods.build.failure(locale.i18n.buildDependProblemTip);
        }

        /** 替换代码文件中的配置信息 */
        function replaceFiles() {
            changeProgress(2);
            let manifestMetaDataCode = '';
            const newXShareCode = configs.basicConfig.newXSharePrefs === 0 ? '' :
                codeFiles['AndroidManifest.xml'].newXSharePrefs(configs.basicConfig.newXSharePrefs === 1);
            switch (configs.basicConfig.targetXposedPlatform) {
                case 0:
                    manifestMetaDataCode = codeFiles.append(manifestMetaDataCode, codeFiles['AndroidManifest.xml'].xposedModule(),
                        newXShareCode, codeFiles['AndroidManifest.xml'].moduleScope());
                    break;
                case 1:
                    manifestMetaDataCode = codeFiles.append(manifestMetaDataCode, newXShareCode,
                        codeFiles['AndroidManifest.xml'].moduleScope());
                    break;
                case 2:
                    // TODO LSPatch WIP
                    break;
                case 3:
                case 4:
                    manifestMetaDataCode = codeFiles.append(manifestMetaDataCode, codeFiles['AndroidManifest.xml'].xposedModule());
                    /** 不需要作用域直接删掉作用域定义的数组文件 */
                    fileSystem.delete(fileSystem.path(targetPath, 'app', 'src', 'main', 'res', 'values', 'array.xml'));
                    break;
            }
            manifestMetaDataCode = manifestMetaDataCode.trim();
            let moduleActiveStatusCode = '';
            switch (configs.basicConfig.targetXposedPlatform) {
                case 2:
                    // TODO LSPatch WIP
                    break;
                case 0:
                    moduleActiveStatusCode = codeFiles['MainActivity.kt'].isModuleActive();
                    break;
                case 1:
                case 4:
                    moduleActiveStatusCode = codeFiles['MainActivity.kt'].isXposedModuleActive();
                    break;
                case 3:
                    moduleActiveStatusCode = codeFiles['MainActivity.kt'].isTaiChiModuleActive();
                    break;
            }
            moduleActiveStatusCode = moduleActiveStatusCode.trim();
            let moduleScopesCode = '';
            if (configs.basicConfig.moduleScopes.length > 0)
                configs.basicConfig.moduleScopes.forEach((value) => {
                    moduleScopesCode = codeFiles.append(moduleScopesCode, codeFiles['array.xml'].item(value));
                });
            moduleScopesCode = moduleScopesCode.trim();
            let hookEntryAnnotationCode = '';
            if (configs.yukiHookApiConfig.entryClassName !== '')
                hookEntryAnnotationCode = hookEntryAnnotationCode.concat(
                    codeFiles['HookEntry.kt'].annotations.entryClassName(configs.yukiHookApiConfig.entryClassName), ', ');
            if (configs.yukiHookApiConfig.supportResourcesHook !== 0)
                hookEntryAnnotationCode = hookEntryAnnotationCode.concat(
                    codeFiles['HookEntry.kt'].annotations.supportResourcesHook(configs.yukiHookApiConfig.supportResourcesHook === 1));
            if (configs.yukiHookApiConfig.supportResourcesHook !== 0 && configs.yukiHookApiConfig.enableModuleStatus !== 0)
                hookEntryAnnotationCode = hookEntryAnnotationCode.concat(', ');
            if (configs.yukiHookApiConfig.enableModuleStatus !== 0)
                hookEntryAnnotationCode = hookEntryAnnotationCode.concat(
                    codeFiles['HookEntry.kt'].annotations.supportXposedModuleStatus(configs.yukiHookApiConfig.enableModuleStatus === 1));
            if (hookEntryAnnotationCode.trim() !== '')
                hookEntryAnnotationCode = '(' + (hookEntryAnnotationCode.trim().endsWith(',') ?
                    hookEntryAnnotationCode.trim().substring(0, hookEntryAnnotationCode.trim().lastIndexOf(',')) :
                    hookEntryAnnotationCode.trim()) + ')';
            let hookEntryConfigsCode = '';
            if (configs.yukiHookApiConfig.debugLogTagName !== '' || configs.yukiHookApiConfig.enableDebugLog !== 0) {
                hookEntryConfigsCode += 'debugLog {\n';
                hookEntryConfigsCode += codeFiles.space(12);
                if (configs.yukiHookApiConfig.debugLogTagName !== '') {
                    hookEntryConfigsCode = codeFiles.append(hookEntryConfigsCode,
                        codeFiles['HookEntry.kt'].configs.debugLog.tagName(configs.yukiHookApiConfig.debugLogTagName));
                    if (configs.yukiHookApiConfig.enableDebugLog !== 0) hookEntryConfigsCode += codeFiles.space(4);
                }
                if (configs.yukiHookApiConfig.enableDebugLog !== 0)
                    hookEntryConfigsCode = codeFiles.append(hookEntryConfigsCode,
                        codeFiles['HookEntry.kt'].configs.debugLog.enable(configs.yukiHookApiConfig.enableDebugLog === 1));
                hookEntryConfigsCode += '}\n';
                hookEntryConfigsCode += codeFiles.space(8);
            }
            if (configs.yukiHookApiConfig.enableDebug !== 0)
                hookEntryConfigsCode = codeFiles.append(hookEntryConfigsCode,
                    codeFiles['HookEntry.kt'].configs.enableDebug(configs.yukiHookApiConfig.enableDebug === 1));
            if (configs.yukiHookApiConfig.enableResourcesCache !== 0)
                hookEntryConfigsCode = codeFiles.append(hookEntryConfigsCode,
                    codeFiles['HookEntry.kt'].configs.enableResourcesCache(configs.yukiHookApiConfig.enableResourcesCache === 1));
            if (configs.yukiHookApiConfig.enableYChannel !== 0)
                hookEntryConfigsCode = codeFiles.append(hookEntryConfigsCode,
                    codeFiles['HookEntry.kt'].configs.enableYChannel(configs.yukiHookApiConfig.enableYChannel === 1));
            hookEntryConfigsCode = hookEntryConfigsCode.trim();
            if (hookEntryConfigsCode === '') hookEntryConfigsCode = '// Your code here.';
            fileSystem.replaces(targetPath, ['gradle.kts', 'properties', 'kt', 'xml', 'toml'], [
                {
                    placeholder: '{GRADLE_PAPER}',
                    value: configs.projectDependencies.gradlePaper
                }, {
                    placeholder: '{GRADLE_PROPERTIES_DATE}',
                    value: dateTime.cstTime()
                }, {
                    placeholder: '{GROPIFY_VERSION}',
                    value: configs.projectDependencies.gropifyVersion
                }, {
                    placeholder: '{AGP_VERSION}',
                    value: configs.projectDependencies.androidGradlePluginVersion
                }, {
                    placeholder: '{KOTLIN_VERSION}',
                    value: configs.projectDependencies.kotlinVersion
                }, {
                    placeholder: '{KOTLIN_KSP_VERSION}',
                    value: configs.projectDependencies.kotlinKspVersion
                }, {
                    placeholder: '{YUKIHOOKAPI_VERSION}',
                    value: configs.projectDependencies.yukiHookApiVersion
                }, {
                    placeholder: '{PROJECT_NAME}',
                    value: configs.basicConfig.projectName
                }, {
                    placeholder: '{PACKAGE_NAME}',
                    value: configs.basicConfig.packageName
                }, {
                    placeholder: '{APP_NAME}',
                    value: configs.basicConfig.appName
                }, {
                    placeholder: '{MODULE_DESCRIPTION}',
                    value: configs.basicConfig.moduleDescription
                }, {
                    placeholder: '{APP_MIN_API}',
                    value: configs.basicConfig.appMinApi
                }, {
                    placeholder: '{APP_TARGET_API}',
                    value: configs.basicConfig.appTargetApi
                }, {
                    placeholder: '{XPOSED_MIN_API}',
                    value: configs.basicConfig.xposedMinApi
                }, {
                    placeholder: '{META_DATA}',
                    value: manifestMetaDataCode
                }, {
                    placeholder: '{SCOPE_ITEMS}',
                    value: moduleScopesCode
                }, {
                    placeholder: '{YUKIHOOKAPI_MODULE_ACTIVE_STATUS}',
                    value: moduleActiveStatusCode
                }, {
                    placeholder: '{YUKIHOOKAPI_ANNOTATION}',
                    value: hookEntryAnnotationCode
                }, {
                    placeholder: '{YUKIHOOKAPI_CONFIGS}',
                    value: hookEntryConfigsCode
                }
            ], () => {
                moveToPackageName();
            });
        }

        /**
         * 格式化为 main 目录路径
         * @param name 目录名称
         * @return string
         */
        function parseMainPath(name) {
            return fileSystem.path(targetPath, 'app', 'src', name);
        }

        /** 开始创建项目 */
        function preToBuild() {
            changeProgress(1);
            if (fileSystem.exists(parseMainPath('main-fully'), parseMainPath('main-blank'), parseMainPath('main-nogui')))
                switch (configs.basicConfig.moduleCompoment) {
                    case 0:
                        fileSystem.rename(parseMainPath('main-fully'), 'main-fully', 'main', () => {
                            fileSystem.deletes(() => {
                                replaceFiles();
                            }, parseMainPath('main-blank'), parseMainPath('main-nogui'));
                        });
                        break;
                    case 1:
                        fileSystem.rename(parseMainPath('main-blank'), 'main-blank', 'main', () => {
                            fileSystem.deletes(() => {
                                replaceFiles();
                            }, parseMainPath('main-fully'), parseMainPath('main-nogui'));
                        });
                        break;
                    case 2:
                        fileSystem.rename(parseMainPath('main-nogui'), 'main-nogui', 'main', () => {
                            fileSystem.deletes(() => {
                                replaceFiles();
                            }, parseMainPath('main-fully'), parseMainPath('main-blank'));
                        });
                        break;
                    default:
                        appWindow.webContents.methods.build.failure(locale.i18n.buildingFailureTip);
                        break;
                }
            else appWindow.webContents.methods.build.failure(locale.i18n.buildDependProblemTip);
        }

        fileSystem.copy(ossPath, outPath, () => {
            if (fileSystem.exists(outPath)) {
                unzip.extract(outPath, appConfig.dataPath);
                unzip.progress((fileIndex, fileCount) => {
                    appWindow.webContents.methods.build.changeStatus(locale.format(locale.i18n.unpackingTemplateTip,
                        fileIndex, fileCount));
                });
                unzip.success(() => {
                    preToBuild();
                });
                unzip.failure((error) => {
                    appWindow.webContents.methods.build.failure(locale.i18n.buildingFailureTip + '<br/>' + error.toString());
                });
            } else appWindow.webContents.methods.build.failure(locale.i18n.buildingFailureTip);
        });
    },
    /**
     * 完成任务
     * @param configs 项目配置
     */
    finish: (configs) => {
        appWindow.webContents.methods.build.complete(
            (locale.i18n.buildCompleteTip + '<br/><br/>' +
                locale.i18n.projectName + ': ' + configs.basicConfig.projectName + '<br/>' +
                locale.i18n.moduleName + ': ' + configs.basicConfig.appName + '<br/>' +
                locale.i18n.moduleDescription + ': ' + configs.basicConfig.moduleDescription.replace(/\n/g, '&nbsp') + '<br/>' +
                locale.i18n.gradlePaper + ': ' + configs.projectDependencies.gradlePaper + '<br/>' +
                locale.i18n.agpVersion + ': ' + configs.projectDependencies.androidGradlePluginVersion + '<br/>' +
                locale.i18n.kotlinVersion + ': ' + configs.projectDependencies.kotlinVersion + '<br/>' +
                locale.i18n.yukiHookApiVersion + ': ' + configs.projectDependencies.yukiHookApiVersion + '<br/><br/>' +
                locale.i18n.buildPathNoticeTip + '<br/><br/>' + transaction.projectPath.replace(/\\/g, '&#92;')
            )
        );
    }
};

module.exports = {transaction};