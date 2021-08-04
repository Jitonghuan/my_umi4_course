import ds from '@config/defaultSettings';

/** 应用名 */

export const queryappManageList = `${ds.apiPrefix}/appManage/list`;

/** 环境名 */

export const queryappManageEnvList = `${ds.apiPrefix}/monitorManage/app/env`;

/**
 * Prometheus监控
 */

/* 监控对象 */

// 查询列表
export const queryPrometheusList = `${ds.apiPrefix}/monitorManage/serviceMonitor/list`;

// 创建
export const createPrometheus = `${ds.apiPrefix}/monitorManage/serviceMonitor/create`;

// 编辑
export const updatePrometheus = `${ds.apiPrefix}/monitorManage/serviceMonitor/update`;

// 删除
export const deletePrometheus = `${ds.apiPrefix}/monitorManage/serviceMonitor/delete`;

/* 报警规则 */

// 查询列表
export const queryRulesList = `${ds.apiPrefix}/monitorManage/rules/list`;

// 创建
export const createRules = `${ds.apiPrefix}/monitorManage/rules/create`;

// 编辑
export const updateRules = `${ds.apiPrefix}/monitorManage/rules/update`;

// 删除
export const deleteRules = `${ds.apiPrefix}/monitorManage/rules/delete`;

/**
 * 模板管理
 */

/* 报警规则模板 */

// 查询列表
export const queryRuleTemplatesList = `${ds.apiPrefix}/monitorManage/ruleTemplates/list`;

// 创建
export const createRuleTemplates = `${ds.apiPrefix}/monitorManage/ruleTemplates/create`;

// 编辑
export const updateRuleTemplates = `${ds.apiPrefix}/monitorManage/ruleTemplates/update`;

// 删除
export const deleteRuleTemplates = `${ds.apiPrefix}/monitorManage/ruleTemplates/delete`;

/**
 * 报警历史
 */

// 查询列表
export const queryAlertManageList = `${ds.apiPrefix}/monitorManage/alertrecord/list`;

/** 分类*/
export const queryGroupList = `${ds.apiPrefix}/monitorManage/rules/group/list`;

/** 启用禁用 */
export const ruleTemplatesSwitch = `${ds.apiPrefix}/monitorManage/ruleTemplates/switch`;

export const ruleSwitch = `${ds.apiPrefix}/monitorManage/rules/switch`;

/** GET 获取用户名 */
export const getUserList = `${ds.apiPrefix}/appManage/user/listAll`;
