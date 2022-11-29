import appConfig from '@/app.config';

/** 应用名 */

export const queryappManageList = `${appConfig.apiPrefix}/appManage/list`;

/** 环境名 */

export const queryappManageEnvList = `${appConfig.apiPrefix}/monitorManage/app/env`;

/**
 * Prometheus监控
 */

/* 监控对象 */

// 查询列表
export const queryPrometheusList = `${appConfig.apiPrefix}/monitorManage/serviceMonitor/list`;

// 创建
export const createPrometheus = `${appConfig.apiPrefix}/monitorManage/serviceMonitor/create`;

// 编辑
export const updatePrometheus = `${appConfig.apiPrefix}/monitorManage/serviceMonitor/update`;

// 删除
export const deletePrometheus = `${appConfig.apiPrefix}/monitorManage/serviceMonitor/delete`;

/* 报警规则 */

// 查询列表
export const queryRulesList = `${appConfig.apiPrefix}/monitorManage/rules/list`;

// 创建
export const createRules = `${appConfig.apiPrefix}/monitorManage/rules/create`;

// 编辑
export const updateRules = `${appConfig.apiPrefix}/monitorManage/rules/update`;

// 删除
export const deleteRules = `${appConfig.apiPrefix}/monitorManage/rules/delete`;

/**
 * 模板管理
 */

/* 报警规则模板 */

// 查询列表
export const queryRuleTemplatesList = `${appConfig.apiPrefix}/monitorManage/ruleTemplates/list`;

// 创建
export const createRuleTemplates = `${appConfig.apiPrefix}/monitorManage/ruleTemplates/create`;

// 编辑
export const updateRuleTemplates = `${appConfig.apiPrefix}/monitorManage/ruleTemplates/update`;

// 删除
export const deleteRuleTemplates = `${appConfig.apiPrefix}/monitorManage/ruleTemplates/delete`;

// 查询业务报警规则
export const rulesList = `${appConfig.apiPrefix}/monitorManage/rules/list`;

/**
 * 报警历史
 */

// 查询列表
export const queryAlertManageList = `${appConfig.apiPrefix}/monitorManage/alertrecord/list`;

/** 分类*/
export const queryGroupList = `${appConfig.apiPrefix}/monitorManage/rules/group/list`;

/** 启用禁用 */
export const ruleTemplatesSwitch = `${appConfig.apiPrefix}/monitorManage/ruleTemplates/switch`;

export const ruleSwitch = `${appConfig.apiPrefix}/monitorManage/rules/switch`;

/** GET 获取用户名 */
export const getUserList = `${appConfig.apiPrefix}/appManage/user/listAll`;
