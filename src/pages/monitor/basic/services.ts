// basic monitor api
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/16 19:51

import { addAPIPrefix } from '@/utils';

/** 应用名 */
export const queryappManageList = addAPIPrefix('/appManage/list');

/** 环境名 */
export const queryappManageEnvList = addAPIPrefix('/monitorManage/app/env');

/**
 * Prometheus监控
 */

/* 监控对象 */

// 查询列表
export const queryPrometheusList = addAPIPrefix('/monitorManage/serviceMonitor/list');

// 创建
export const createPrometheus = addAPIPrefix('/monitorManage/serviceMonitor/create');

// 编辑
export const updatePrometheus = addAPIPrefix('/monitorManage/serviceMonitor/update');

// 删除
export const deletePrometheus = addAPIPrefix('/monitorManage/serviceMonitor/delete');

/* 报警规则 */

// 查询列表
export const queryRulesList = addAPIPrefix('/monitorManage/rules/list');

// 创建
export const createRules = addAPIPrefix('/monitorManage/rules/create');

// 编辑
export const updateRules = addAPIPrefix('/monitorManage/rules/update');

// 删除
export const deleteRules = addAPIPrefix('/monitorManage/rules/delete');

/**
 * 模板管理
 */

/* 报警规则模板 */

// 查询列表
export const queryRuleTemplatesList = addAPIPrefix('/monitorManage/ruleTemplates/list');

// 创建
export const createRuleTemplates = addAPIPrefix('/monitorManage/ruleTemplates/create');

// 编辑
export const updateRuleTemplates = addAPIPrefix('/monitorManage/ruleTemplates/update');

// 删除
export const deleteRuleTemplates = addAPIPrefix('/monitorManage/ruleTemplates/delete');

/**
 * 报警历史
 */

// 查询列表
export const queryAlertManageList = addAPIPrefix('/monitorManage/alertrecord/list');

/** 分类*/
export const queryGroupList = addAPIPrefix('/monitorManage/rules/group/list');

/** 启用禁用 */
export const ruleTemplatesSwitch = addAPIPrefix('/monitorManage/ruleTemplates/switch');

export const ruleSwitch = addAPIPrefix('/monitorManage/rules/switch');

/** GET 获取用户名 */
export const getUserList = addAPIPrefix('/appManage/user/listAll');
