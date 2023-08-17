// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols

/*
 * YukiHookAPI Project Builder - A Xposed Project Builder by YukiHookAPI.
 * Copyright (C) 2019-2023 HighCapable
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
 * This file is Created by fankes on 2022/7/8.
 */

const {ipcRenderer, ipcMain} = require('electron');
const {locale} = require('../libs/locale');

/** 防止 jQuery 与 Electron 冲突 */
window.$ = window.jQuery = require('./js/jquery.min.js');

/**
 * 对话框集合命名空间
 */
const dialogs = {
    /** 添加模块作用域对话框 */
    moduleScope: new mdui.Dialog('#module_scope_dialog'),
    /** 搜索项目依赖对话框 */
    searchDepend: new mdui.Dialog('#search_depend_dialog', {modal: true, closeOnEsc: false}),
    /** 配置项目依赖对话框 */
    configPackage: new mdui.Dialog('#config_package_dialog', {modal: true, closeOnEsc: false}),
    /** 创建进行中对话框 */
    packagingProgress: new mdui.Dialog('#packaging_progress_dialog', {modal: true, closeOnEsc: false})
}

/** 当前获取到的在线依赖内容 */
const dependenciesConfigs = {
    gradlePapers: [],
    androidGradlePluginVersions: [],
    kotlinVersions: [],
    yukiHookApiVersions: []
};

/** 当前项目的配置内容 */
const projectConfigs = {
    basicConfig: {
        projectName: '',
        packageName: '',
        appName: '',
        moduleDescription: '',
        appMinApi: 27,
        appTargetApi: 33,
        xposedMinApi: 93,
        moduleCompoment: 0,
        targetXposedPlatform: 0,
        newXSharePrefs: 0,
        moduleScopes: []
    },
    yukiHookApiConfig: {
        entryClassName: '',
        debugLogTagName: '',
        supportResourcesHook: 0,
        enableDebug: 0,
        enableDebugLog: 0,
        enableResourcesCache: 0,
        enableModuleStatus: 0,
        enableYChannel: 0,
    },
    projectDependencies: {
        gradlePaper: '',
        androidGradlePluginVersion: '',
        kotlinVersion: '',
        kotlinKspVersion: '',
        yukiHookApiVersion: ''
    }
};

/**
 * 字符串工具命名空间
 */
const valUtils = {
    /**
     * 字符串是否为空
     * @param string 字符串
     * @return boolean
     */
    isEmpty: (string) => {
        if (string === '') return true;
        return new RegExp('^ +$').test(string);
    },
    /**
     * 字符串是否包含字母和数字以外的内容
     * @param string 字符串
     * @return boolean
     */
    hasSpecialChar: (string) => {
        return !valUtils.isEmpty(string) && !(/^[a-zA-Z_]\w*$/.test(string));
    },
    /**
     * 字符串是否包含非法包名
     * @param string 字符串
     * @param isAllowAndroid 是否允许 "android" 包名 - 默认否
     * @return boolean
     */
    hasIncorrectPkgName: (string, isAllowAndroid = false) => {
        return !((string.indexOf('.') >= 0 &&
            string.indexOf('..') < 0 &&
            !string.startsWith('.') &&
            !string.endsWith('.')) || (string === 'android' && isAllowAndroid));
    },
    /**
     * 转换为整型
     * @return number
     */
    integerOf: (value) => {
        return Number.parseInt(value);
    },
    /**
     * 字符串是否以数字开头
     * @param string 字符串
     * @return boolean
     */
    startsWithNumber: (string) => {
        return string.startsWith('0') || string.startsWith('1') ||
            string.startsWith('2') || string.startsWith('3') ||
            string.startsWith('4') || string.startsWith('5') ||
            string.startsWith('6') || string.startsWith('7') ||
            string.startsWith('8') || string.startsWith('9');
    }
};

/** 开始装载 */
window.onload = () => {
    $('#module_scope_text').bind('input propertychange', () => {
        monitor.onModuleScopeTextChange();
    });
    $('#module_scope_select').on('change', () => {
        monitor.onModuleScopeSelectChange();
    });
    $('#target_xposed_platform_select').on('change', () => {
        monitor.onTargetXposedPlatformSelect();
    });
    $('#module_scope_dialog').on('closed.mdui.dialog', () => {
        moduleScope.clearAndCloseDialog();
    });
    $('.url-link').each((_, element) => {
        $(element).on('click', () => {
            page.openBrowser(element.innerText);
        });
    });
};

/**
 * 页面监听器命名空间
 */
const monitor = {
    /** 文本改变监听 */
    onModuleScopeTextChange: () => {
        const value = $('#module_scope_text').val();
        if (value === 'android') $('#module_scope_select').val(1);
        else if (value === 'com.android.systemui') $('#module_scope_select').val(2);
        else $('#module_scope_select').val(0);
    },
    /** 选项改变监听 */
    onModuleScopeSelectChange: () => {
        const moduleScopeText = $('#module_scope_text');
        switch (valUtils.integerOf($('#module_scope_select option:selected').val())) {
            case 0:
                moduleScopeText.val('');
                break;

            case 1:
                moduleScopeText.val('android');
                break;

            case 2:
                moduleScopeText.val('com.android.systemui');
                break;
        }
    },
    /** 选项改变监听 */
    onTargetXposedPlatformSelect: () => {
        const newXSharePrefsDiv = $('#new_xshare_prefs_div');
        const moduleScopeDiv = $('#module_scope_div');
        switch (valUtils.integerOf($('#target_xposed_platform_select option:selected').val())) {
            case 3:
            case 4:
                $('#scope_list').empty();
                $('#new_xshare_prefs_select').val(0);
                newXSharePrefsDiv.hide();
                moduleScopeDiv.hide();
                break;

            default:
                newXSharePrefsDiv.show();
                moduleScopeDiv.show();
                break;
        }
    },
    /** 刷新回调全部监听 */
    refresh: () => {
        monitor.onModuleScopeTextChange();
        monitor.onModuleScopeSelectChange();
        monitor.onTargetXposedPlatformSelect();
        mdui.updateTextFields();
    }
}

/**
 * 控制模块作用域命名空间
 */
const moduleScope = {
    /**
     * 获取当前已添加的模块定义域数组
     * @return Array
     */
    moduleScopesData: () => {
        const scopes = [];
        $('#scope_list div').each((p, dom) => {
            scopes.push($(dom).text());
        });
        return scopes;
    },
    /** 显示添加模块作用域对话框 */
    showAddDialog: () => {
        dialogs.moduleScope.open();
    },
    /** 添加模块作用域 - 使用当前对话框文本 */
    saveData: () => {
        const moduleScopeText = $('#module_scope_text').val();
        if (valUtils.isEmpty(moduleScopeText)) page.snack(locale.i18n.enterPkgNameOrSelectFromListTip);
        else if (valUtils.hasIncorrectPkgName(moduleScopeText, true)) page.snack(locale.i18n.invalidEnterPkgNameTip);
        else if (moduleScope.moduleScopesData().includes(moduleScopeText)) page.snack(locale.i18n.existEnterPkgNameTip);
        else {
            moduleScope.addData(moduleScopeText);
            dialogs.moduleScope.close();
        }
    },
    /**
     * 添加模块作用域
     * @param packageName 包名
     */
    addData: (packageName) => {
        const listId = Date.now();
        const scopeList = $('#scope_list')
        scopeList.append('<label class="mdui-list-item mdui-ripple" id="' + listId + '" style="padding-right: 5px">' +
            '<div class="mdui-list-item-content">' + packageName + '</div>' +
            '<button class="red-circle-btn mdui-ripple" onclick="moduleScope.removeData(\'' + packageName + '\',\''
            + listId + '\')">—</button>' +
            '</label>');
        scopeList.scrollTop(scopeList.prop("scrollHeight"));
    },
    /**
     * 移除模块作用域
     * @param name 名称
     * @param id 列表 Id
     */
    removeData: (name, id) => {
        mdui.confirm(locale.format(locale.i18n.areYouSureRemoveItemTip, name), locale.i18n.notice, () => {
            $('#' + id).remove();
        }, () => null, {confirmText: locale.i18n.ok, cancelText: locale.i18n.cancel});
    },
    /**
     * 刷新当前作用域列表布局
     * @param data 作用域数组
     */
    refresh: (data) => {
        $('#scope_list').html('');
        if (data.length > 0) data.forEach((value) => {
            moduleScope.addData(value);
        });
    },
    /** 恢复默认并关闭添加模块作用域对话框 */
    clearAndCloseDialog: () => {
        $('#module_scope_select').val(0);
        $('#module_scope_text').val('');
        dialogs.moduleScope.close();
    }
};

/**
 * 当前配置表单命名空间
 */
const configForm = {
    projectNameText: () => $('#project_name_text').val(),
    packageNameText: () => $('#package_name_text').val(),
    appNameText: () => $('#app_name_text').val(),
    moduleDescriptionText: () => $('#module_description_text').val(),
    appMinApiText: () => $('#app_min_api_text').val(),
    appTargetApiText: () => $('#app_target_api_text').val(),
    xposedMinApiText: () => $('#xposed_min_api_text').val(),
    entryClassNameText: () => $('#entry_class_name_text').val(),
    debugLogTagNameText: () => $('#debug_log_tag_name_text').val(),
    compomentSelect: () => valUtils.integerOf($('#compoment_select option:selected').val()),
    targetXposedPlatformSelect: () => valUtils.integerOf($('#target_xposed_platform_select option:selected').val()),
    newXSharePrefsSelect: () => valUtils.integerOf($('#new_xshare_prefs_select option:selected').val()),
    supportResourcesHookSelect: () => valUtils.integerOf($('#support_resources_hook_select option:selected').val()),
    enableDebugSelect: () => valUtils.integerOf($('#enable_debug_select option:selected').val()),
    enableDebugLogSelect: () => valUtils.integerOf($('#enable_debug_log_select option:selected').val()),
    enableResourcesCacheSelect: () => valUtils.integerOf($('#enable_resources_cache_select option:selected').val()),
    enableModuleStatusSelect: () => valUtils.integerOf($('#enable_module_status_select option:selected').val()),
    enableYChannelSelect: () => valUtils.integerOf($('#enable_ychannel_select option:selected').val())
}

/**
 * 创建项目命名空间
 */
const build = {
    /** 标识是否正在配置创建项目功能 - 不能重复执行 */
    isLocked: false,
    /**
     * 判断是否正在创建项目 - 自动弹出消息提示
     * @return boolean
     */
    isLockAndMsg: () => {
        if (build.isLocked) page.snack(locale.i18n.taskIsRunningTip);
        return build.isLocked;
    },
    /** 创建配置表单 */
    create: () => {
        projectConfigs.basicConfig.projectName = configForm.projectNameText();
        projectConfigs.basicConfig.packageName = configForm.packageNameText();
        projectConfigs.basicConfig.appName = configForm.appNameText();
        projectConfigs.basicConfig.moduleDescription = configForm.moduleDescriptionText();
        projectConfigs.basicConfig.appMinApi = valUtils.integerOf(configForm.appMinApiText());
        projectConfigs.basicConfig.appTargetApi = valUtils.integerOf(configForm.appTargetApiText());
        projectConfigs.basicConfig.xposedMinApi = valUtils.integerOf(configForm.xposedMinApiText());
        projectConfigs.basicConfig.moduleCompoment = configForm.compomentSelect();
        projectConfigs.basicConfig.targetXposedPlatform = configForm.targetXposedPlatformSelect();
        projectConfigs.basicConfig.newXSharePrefs = configForm.newXSharePrefsSelect();
        projectConfigs.basicConfig.moduleScopes = moduleScope.moduleScopesData();
        projectConfigs.yukiHookApiConfig.entryClassName = configForm.entryClassNameText();
        projectConfigs.yukiHookApiConfig.debugLogTagName = configForm.debugLogTagNameText();
        projectConfigs.yukiHookApiConfig.supportResourcesHook = configForm.supportResourcesHookSelect();
        projectConfigs.yukiHookApiConfig.enableDebug = configForm.enableDebugSelect();
        projectConfigs.yukiHookApiConfig.enableDebugLog = configForm.enableDebugLogSelect();
        projectConfigs.yukiHookApiConfig.enableResourcesCache = configForm.enableResourcesCacheSelect();
        projectConfigs.yukiHookApiConfig.enableModuleStatus = configForm.enableModuleStatusSelect();
        projectConfigs.yukiHookApiConfig.enableYChannel = configForm.enableYChannelSelect();
        projectConfigs.projectDependencies = {
            gradlePaper: '',
            androidGradlePluginVersion: '',
            kotlinVersion: '',
            kotlinKspVersion: '',
            yukiHookApiVersion: ''
        };
    },
    /** 检查并开始创建项目 */
    checking: () => {
        if (build.isLockAndMsg()) return;
        if (valUtils.isEmpty(configForm.projectNameText())) page.snack(locale.i18n.enterProjectNameTip);
        else if (valUtils.hasSpecialChar(configForm.projectNameText())) page.snack(locale.i18n.projectNameRuleTip);
        else if (valUtils.isEmpty(configForm.packageNameText())) page.snack(locale.i18n.enterModulePackageNameTip);
        else if (valUtils.hasIncorrectPkgName(configForm.packageNameText())) page.snack(locale.i18n.invalidModulePackageNameTip);
        else if (valUtils.isEmpty(configForm.appNameText())) page.snack(locale.i18n.enterModuleAppNameTip);
        else if (valUtils.isEmpty(configForm.moduleDescriptionText())) page.snack(locale.i18n.enterModuleDescriptionTip);
        else if (valUtils.isEmpty(configForm.appMinApiText())) page.snack(locale.i18n.enterAppMinApiVersionTip);
        else if (configForm.targetXposedPlatformSelect() === 2 && configForm.appMinApiText() < 27) page.snack(locale.i18n.lsposedSupportMinAppApiWarnTip);
        else if (configForm.appMinApiText() < 21) page.snack(locale.i18n.tooLowAppMinApiVersionWarnTip);
        else if (configForm.appMinApiText() > 33) page.snack(locale.i18n.tooHighAppMinApiVersionWarnTip);
        else if (valUtils.isEmpty(configForm.appTargetApiText())) page.snack(locale.i18n.enterAppTargetApiVersionTip);
        else if (configForm.appTargetApiText() < configForm.appMinApiText()) page.snack(locale.i18n.tooLowAppTargetApiVersionWarnTip);
        else if (configForm.appTargetApiText() > 33) page.snack(locale.i18n.maybeInvalidAppTargetApiVersionTip);
        else if (valUtils.isEmpty(configForm.xposedMinApiText())) page.snack(locale.i18n.enterXposedMinApiVersionTip);
        else if (configForm.xposedMinApiText() < 82) page.snack(locale.i18n.tooLowXposedMinApiVersionWarnTip);
        else if (configForm.xposedMinApiText() > 93) page.snack(locale.i18n.tooHighXposedMinApiVersionWarnTip);
        else if (valUtils.hasSpecialChar(configForm.entryClassNameText())) page.snack(locale.i18n.entryClassNameRuleTip);
        else if (configForm.targetXposedPlatformSelect() !== 3 && configForm.targetXposedPlatformSelect() !== 4
            && moduleScope.moduleScopesData().length <= 0) page.snack(locale.i18n.moduleScopeRuleTip);
        else {
            build.create();
            projectDepends.search();
        }
    },
    /** 开始创建项目 */
    run: () => {
        projectConfigs.projectDependencies.gradlePaper = $('#gradle_version_select option:selected').text();
        projectConfigs.projectDependencies.androidGradlePluginVersion = $('#agp_version_select option:selected').text();
        const kotlinVersionSelect = $('#kotlin_version_select option:selected');
        projectConfigs.projectDependencies.kotlinVersion = kotlinVersionSelect.text();
        projectConfigs.projectDependencies.kotlinKspVersion = kotlinVersionSelect.val();
        projectConfigs.projectDependencies.yukiHookApiVersion = $('#yukihookapi_version_select option:selected').text();
        dialogs.configPackage.close();
        dialogs.packagingProgress.open();
        build.changeStatus(locale.i18n.waitingForBuildingTip);
        ipcRenderer.send('run-packaging-project', projectConfigs);
    },
    /**
     * 改变创建过程提示文本
     * @param msg 文本内容
     */
    changeStatus: (msg) => {
        $('#packaging_progress_text').html(msg);
    },
    /**
     * 完成创建项目
     * @param msg 文本内容
     */
    complete: (msg) => {
        dialogs.packagingProgress.close();

        /** 显示保存为模版对话框 */
        function showSaveToTemplate() {
            mdui.confirm(locale.i18n.doYouWantSaveConfigTemplateTip, locale.i18n.notice, () => {
                build.unlockStatus();
                configTemplate.createNew();
            }, () => {
                build.unlockStatus();
                page.reload();
            }, {confirmText: locale.i18n.ok, cancelText: locale.i18n.cancel, modal: true, closeOnEsc: false});
        }

        mdui.confirm(msg, locale.i18n.buildComplete, () => {
            ipcRenderer.send('open-complete-project');
            showSaveToTemplate();
        }, () => {
            showSaveToTemplate();
        }, {confirmText: locale.i18n.openProject, cancelText: locale.i18n.done, modal: true, closeOnEsc: false});
    },
    /**
     * 创建项目失败
     * @param msg 文本内容
     */
    failure: (msg) => {
        dialogs.packagingProgress.close();
        build.unlockStatus();
        mdui.alert(msg, locale.i18n.notice, () => null, {confirmText: locale.i18n.ok});
    },
    /** 取消创建项目任务 */
    cancel: () => {
        dialogs.packagingProgress.close();
        build.unlockStatus();
        page.snack(locale.i18n.operationCancelledTip);
    },
    /** 锁定创建项目状态 */
    lockStatus: () => {
        build.isLocked = true;
    },
    /** 解锁创建项目状态 */
    unlockStatus: () => {
        build.isLocked = false;
    }
};

/**
 * 依赖查找功能命名空间
 */
const projectDepends = {
    /** 依赖 API 获取地址 */
    urls: {
        gradlePaper: 'https://services.gradle.org/distributions',
        androidGradlePlugin: 'https://dl.google.com/dl/android/maven2/com/android/application/com.android.application.gradle.plugin/maven-metadata.xml',
        kotlin: 'https://api.github.com/repos/JetBrains/kotlin/releases',
        kotlinKsp: 'https://api.github.com/repos/google/ksp/releases',
        yukiHookApi: 'https://api.github.com/repos/fankes/YukiHookAPI/releases'
    },
    /** 搜索项目依赖 */
    search() {
        build.lockStatus();
        dialogs.searchDepend.open();
        projectDepends.findGradlePaper();
    },
    /** 依赖装载完成 */
    loaded() {
        dialogs.searchDepend.close();
        const gradleVersionSelect = $('#gradle_version_select');
        gradleVersionSelect.html('');
        dependenciesConfigs.gradlePapers.forEach((value) => {
            gradleVersionSelect.append('<option value="' + value + '">' + value + '</option>');
        });
        const agpVersionSelect = $('#agp_version_select');
        agpVersionSelect.html('');
        dependenciesConfigs.androidGradlePluginVersions.forEach((value) => {
            agpVersionSelect.append('<option value="' + value + '">' + value + '</option>');
        });
        const kotlinVersionSelect = $('#kotlin_version_select');
        kotlinVersionSelect.html('');
        dependenciesConfigs.kotlinVersions.forEach((value) => {
            kotlinVersionSelect.append('<option value="' + value.ksp + '">' + value.main + '</option>');
        });
        const yukiHookApiVersionSelect = $('#yukihookapi_version_select');
        yukiHookApiVersionSelect.html('');
        dependenciesConfigs.yukiHookApiVersions.forEach((value) => {
            yukiHookApiVersionSelect.append('<option value="' + value + '">' + value + '</option>');
        });
        dialogs.configPackage.open();
    },
    /**
     * 回调检索失败
     * @param name 名称
     * @param isNetFail 是否为网络错误
     */
    failure: (name, isNetFail = true) => {
        dialogs.searchDepend.close();
        build.unlockStatus();
        mdui.alert(isNetFail ? locale.i18n.networkErrorTip : locale.i18n.ruleCheckFailTip,
            locale.format(locale.i18n.findDependContentFail, name), () => null, {confirmText: locale.i18n.ok});
    },
    /** 获取 Gradle 构建器 */
    findGradlePaper: () => {
        httpClient.requestDepends('Gradle', projectDepends.urls.gradlePaper, (body) => {
            dependenciesConfigs.gradlePapers = [];
            let index = 0;
            $(body).find('.items .name').each((_, element) => {
                const isValied = (element.innerText.endsWith('bin.zip') || element.innerText.endsWith('all.zip'))
                    && element.innerText.indexOf('-rc-') < 0 && element.innerText.indexOf('mile') < 0;
                if (isValied) index++;
                if (index <= 20 && isValied) dependenciesConfigs.gradlePapers.push(element.innerText.trim());
            });
            if (dependenciesConfigs.gradlePapers.length > 0)
                projectDepends.findAgpVersion();
            else projectDepends.failure('Gradle', false);
        });
    },
    /** 获取 AGP 版本 */
    findAgpVersion: () => {
        httpClient.requestDepends('Android Gradle Plugin', projectDepends.urls.androidGradlePlugin, (body) => {
            dependenciesConfigs.androidGradlePluginVersions = [];
            const versionsNode = body.getElementsByTagName('version');
            let versions = [];
            for (let i = versionsNode.length - 1; i >= 0; i--) {
                const version = versionsNode[i].innerHTML;
                if (version.indexOf('-alpha') < 0 && version.indexOf('-beta') < 0 && version.indexOf('-rc') < 0) versions.push(version);
            }
            dependenciesConfigs.androidGradlePluginVersions = versions;
            if (dependenciesConfigs.androidGradlePluginVersions.length > 0)
                projectDepends.findKotlinVersion();
            else projectDepends.failure('Android Gradle Plugin', false);
        });
    },
    /** 获取 Kotlin 版本 */
    findKotlinVersion: () => {
        httpClient.requestDepends('Kotlin', projectDepends.urls.kotlin, (body) => {
            dependenciesConfigs.kotlinVersions = [];
            body.forEach((value) => {
                const tagName = value['tag_name'];
                if (tagName.indexOf('-') < 0)
                    dependenciesConfigs.kotlinVersions.push({main: tagName.replace('v', ''), ksp: ''});
            });
            if (dependenciesConfigs.kotlinVersions.length > 0)
                projectDepends.findKotlinKspVersion();
            else projectDepends.failure('Kotlin', false);
        });
    },
    /** 获取 Kotlin-Ksp 版本 */
    findKotlinKspVersion: () => {
        httpClient.requestDepends('Kotlin-Ksp', projectDepends.urls.kotlinKsp, (body) => {
            body.forEach((value) => {
                const tagName = value['tag_name'];
                if (tagName.toLowerCase().indexOf('rc') < 0 && tagName.toLowerCase().indexOf('beta') < 0)
                    dependenciesConfigs.kotlinVersions.forEach((each) => {
                        if (tagName.startsWith(each.main)) each.ksp = tagName;
                    });
            });
            dependenciesConfigs.kotlinVersions = dependenciesConfigs.kotlinVersions.filter((value) => {
                return !valUtils.isEmpty(value.ksp);
            });
            if (dependenciesConfigs.kotlinVersions.length > 0)
                projectDepends.findYukiHookApiVersion();
            else projectDepends.failure('Kotlin-Ksp', false);
        });
    },
    /** 获取 YukiHookAPI 版本 */
    findYukiHookApiVersion: () => {
        httpClient.requestDepends('YukiHookAPI', projectDepends.urls.yukiHookApi, (body) => {
            dependenciesConfigs.yukiHookApiVersions = [];
            const latestVersion = body.length > 0 ? body[0]['tag_name'] : '';
            if (latestVersion !== '') {
                dependenciesConfigs.yukiHookApiVersions.push(latestVersion);
                projectDepends.loaded();
            } else projectDepends.failure('YukiHookAPI', false);
        });
    }
};

/**
 * 配置模板命名空间
 */
const configTemplate = {
    /**
     * 从模板加载并覆盖当前配置
     * @param configs 模板
     */
    load: (configs) => {
        if (build.isLockAndMsg()) return;
        const parse = JSON.parse(decodeURI(configs));
        const data = parse.value;
        mdui.confirm(locale.format(locale.i18n.doYouWantLoadConfigTemplateTip, parse.name), locale.i18n.notice, () => {
            $('#project_name_text').val(data.basicConfig.projectName);
            $('#package_name_text').val(data.basicConfig.packageName);
            $('#app_name_text').val(data.basicConfig.appName);
            $('#module_description_text').val(data.basicConfig.moduleDescription);
            $('#app_min_api_text').val(data.basicConfig.appMinApi);
            $('#app_target_api_text').val(data.basicConfig.appTargetApi);
            $('#xposed_min_api_text').val(data.basicConfig.xposedMinApi);
            $('#entry_class_name_text').val(data.yukiHookApiConfig.entryClassName);
            $('#debug_log_tag_name_text').val(data.yukiHookApiConfig.debugLogTagName);
            $('#compoment_select').val(data.basicConfig.moduleCompoment);
            $('#target_xposed_platform_select').val(data.basicConfig.targetXposedPlatform);
            $('#new_xshare_prefs_select').val(data.basicConfig.newXSharePrefs);
            $('#support_resources_hook_select').val(data.yukiHookApiConfig.supportResourcesHook);
            $('#enable_debug_select').val(data.yukiHookApiConfig.enableDebug);
            $('#enable_debug_log_select').val(data.yukiHookApiConfig.enableDebugLog);
            $('#enable_resources_cache_select').val(data.yukiHookApiConfig.enableResourcesCache);
            $('#enable_module_status_select').val(data.yukiHookApiConfig.enableModuleStatus);
            $('#enable_ychannel_select').val(data.yukiHookApiConfig.enableYChannel);
            monitor.refresh();
            moduleScope.refresh(data.basicConfig.moduleScopes);
            page.snack(locale.format(locale.i18n.configTemplateLoaded, parse.name));
        }, () => null, {confirmText: locale.i18n.ok, cancelText: locale.i18n.cancel});
    },
    /** 保存当前配置到模板 */
    createNew: () => {
        if (build.isLockAndMsg()) return;
        mdui.prompt(locale.i18n.enterTemplateNameTip, locale.i18n.newTemplateByCurrentConfig, (value, dialog) => {
            if (valUtils.isEmpty(value)) page.snack(locale.i18n.enterTemplateNameTip);
            else {
                build.create();
                ipcRenderer.send('save-config-template', {name: value, value: projectConfigs});
                dialog.close();
                page.snack(locale.format(locale.i18n.configTemplateSaved, value));
            }
        }, () => null, {confirmText: locale.i18n.ok, cancelText: locale.i18n.cancel, closeOnConfirm: false});
    },
    /** 清空全部模板 */
    clearAll: () => {
        if (build.isLockAndMsg()) return;
        mdui.confirm(locale.i18n.areYouSureClearAllTemplateTip, locale.i18n.notice, () => {
            ipcRenderer.send('clear-all-config-template');
            page.snack(locale.i18n.configTemplateCleared);
        }, () => null, {confirmText: locale.i18n.ok, cancelText: locale.i18n.cancel});
    }
};

/**
 * 当前页面命名空间
 */
const page = {
    /** 当前应用程序版本 */
    appVersion: '',
    /**
     * 初始化页面
     *
     * 启动时调用 - 不完成初始化页面将显示为空白
     * @param localeName 语言区域名称
     * @param appVersion 应用程序版本
     */
    init: (localeName, appVersion) => {
        page.appVersion = appVersion;
        locale.initLocale(localeName);
        $('title').text(locale.i18n.windowTitle);
        $('.i18n').each((_, element) => {
            const placeholder = $(element).attr('placeholder');
            const isUsePlaceholder = placeholder !== undefined;
            const innerHtml = isUsePlaceholder ? placeholder : element.innerHTML;
            if (innerHtml.indexOf('{{') < 0 || innerHtml.indexOf('}}') < 0) return;
            const i18nText = locale.i18n[innerHtml.split('{{')[1].split('}}')[0].trim()];
            if (i18nText !== undefined)
                if (isUsePlaceholder)
                    $(element).attr('placeholder', innerHtml.replace(/\{\{(.*)}}/, i18nText));
                else element.innerHTML = innerHtml.replace(/\{\{(.*)}}/, i18nText);
        });
        /** 初始化必要数据 */
        $('#app_min_api_text').val(projectConfigs.basicConfig.appMinApi);
        $('#app_target_api_text').val(projectConfigs.basicConfig.appTargetApi);
        $('#xposed_min_api_text').val(projectConfigs.basicConfig.xposedMinApi);
        /** 显示页面 */
        $('#root_div').show();
        page.checkForUpdates(false);
    },
    /**
     * 弹出提示
     * @param message 消息
     */
    snack: (message) => {
        mdui.snackbar({message: message});
    },
    /**
     * 打开系统默认浏览器
     * @param url 地址
     */
    openBrowser: (url) => {
        ipcRenderer.send('open-system-browser', url);
    },
    /**
     * 显示关于
     * @param name 名称
     * @param version 版本号
     */
    showAbout: (name, version) => {
        if (build.isLockAndMsg()) return;
        $('#about_name_text').html(name);
        $('#about_version_text').html(locale.i18n.version + ': ' + version);
        new mdui.Dialog('#about_dialog').open();
    },
    /** 显示开源相关 */
    showOpenSource: () => {
        if (build.isLockAndMsg()) return;
        new mdui.Dialog('#open_source_dialog').open();
    },
    /**
     * 检查更新
     * @param isShowProcess 是否显示正在检查更新的提示
     */
    checkForUpdates: (isShowProcess = true) => {
        if (build.isLockAndMsg()) return;
        if (isShowProcess) page.snack(locale.i18n.checkUpdateTip);
        const repoAuthor = 'fankes';
        const repoName = 'YukiHookAPI-ProjectBuilder';
        httpClient.requestGet('https://api.github.com/repos/' + repoAuthor + '/' + repoName + '/releases/latest', (body) => {
            const newVersion = body['name'] ?? '';
            const updateLogs = body['body']?.replace(/\n/g, "<br/>") ?? '';
            const updateUrl = body['html_url'] ?? '';
            if (newVersion !== page.appVersion)
                mdui.confirm(locale.i18n.version + ':&nbsp' + newVersion + '<br/><br/>' +
                    '<strong>' + locale.i18n.updateLogs + '</strong><br/><br/>' + updateLogs, locale.i18n.newVersionFound, () => {
                    page.openBrowser(updateUrl);
                }, () => null, {
                    confirmText: locale.i18n.updateNow,
                    cancelText: locale.i18n.cancel,
                    modal: true,
                    closeOnEsc: false
                });
            else if (isShowProcess) page.snack(locale.i18n.upToDateTip);
        }, () => {
            if (isShowProcess) page.snack(locale.i18n.checkUpdateFailTip);
        });
    },
    /** 重置当前配置 */
    restore: () => {
        if (build.isLockAndMsg()) return;
        mdui.confirm(locale.i18n.areYouSureRestoreChangeTip, locale.i18n.notice, () => {
            page.reload();
        }, () => null, {confirmText: locale.i18n.ok, cancelText: locale.i18n.cancel});
    },
    /** 初始化页面 */
    reload: () => {
        ipcRenderer.send('reload-current-page');
    },
    /** 重启以生效更改 */
    relaunch: () => {
        if (build.isLockAndMsg()) return;
        mdui.confirm(locale.i18n.mustRestartTakeEffectTip, locale.i18n.notice, () => {
            ipcRenderer.send('relaunch-app');
        }, () => null, {confirmText: locale.i18n.ok, cancelText: locale.i18n.later});
    }
};

/**
 * 网络请求命名空间
 */
const httpClient = {
    /**
     * 请求获取每个依赖的发布页面内容
     * @param name 名称
     * @param url 地址
     * @param onSuccess 回调成功结果
     */
    requestDepends: (name, url, onSuccess) => {
        httpClient.requestGet(url, onSuccess, () => {
            projectDepends.failure(name);
        });
    },
    /**
     * 请求页面内容 GET
     * @param url 地址
     * @param onSuccess 回调成功结果
     * @param onFaiure 回调失败结果
     */
    requestGet: (url, onSuccess, onFaiure) => {
        $.ajax({
            url: url,
            method: 'get',
            success: (body) => {
                onSuccess(body);
            },
            error: () => {
                onFaiure();
            }
        });
    }
};