import appConfig from '@/app.config';

/* 1、POST 新增业务监控 */
export const addMonitor = `${appConfig.apiPrefix}/monitorManage/biz/addMonitor`;
/* 2、PUT 修改业务监控 */
export const updateMonitor = `${appConfig.apiPrefix}/monitorManage/biz/updateMonitor`;
/* 3、DELETE 删除业务监控 */
export const delMonitor = `${appConfig.apiPrefix}/monitorManage/biz/deleteMonitor`;

/* 4、GET 业务监控列表 */
export const getListMonitor = `${appConfig.apiPrefix}/monitorManage/biz/listMonitor`;

/* 5、PUT 启动业务监控 */
export const enableMonitor = `${appConfig.apiPrefix}/monitorManage/biz/enableMonitor`;

/* 6、PUT 停止业务监控 */
export const disableMonitor = `${appConfig.apiPrefix}/monitorManage/biz/disableMonitor`;

/* 8、GET 获取日志源 */
export const getLogSample = `${appConfig.apiPrefix}/monitorManage/biz/getLogSample`;

/** 9、 GET 环境查询 */
export const getEnvCodeList = `${appConfig.apiPrefix}/monitorManage/rules/envCodeList`;

export const getAppList = `${appConfig.apiPrefix}/appManage/list`;

export const ruleIndexOptions = `${appConfig.apiPrefix}/logManage/logSearch/indexModeList`;

export const indexModeFields = `${appConfig.apiPrefix}/logManage/logSearch/indexMode/fields`;

// 创建
export const createRules = `${appConfig.apiPrefix}/monitorManage/rules/create`;

// 编辑
export const updateRules = `${appConfig.apiPrefix}/monitorManage/rules/update`;

// 数据库新增监控项
export const addDbMonitor = `${appConfig.apiPrefix}/monitorManage/biz/sql/create`;

// 数据库修改监控项
export const updateDbMonitor = `${appConfig.apiPrefix}/monitorManage/biz/sql/modify`;

// 获取数据库类型
export const getDbType = `${appConfig.apiPrefix}/monitorManage/biz/sql/dbType`;

// 获取数据库地址
export const getDbAddr = `${appConfig.apiPrefix}/monitorManage/biz/sql/dbAddr`;

// 获取数据库地址
export const postSqlTest = `${appConfig.apiPrefix}/monitorManage/biz/sql/test`;

// 获取数据库监控项
export const getDbListMonitor = `${appConfig.apiPrefix}/monitorManage/biz/sql/list`;

// 数据库监控项启动
export const enableDbMonitor = `${appConfig.apiPrefix}/monitorManage/biz/sql/enable`;

// 数据库监控项停用
export const disableDbMonitor = `${appConfig.apiPrefix}/monitorManage/biz/sql/disable`;

// 数据库监控项删除
export const deleteDbMonitor = `${appConfig.apiPrefix}/monitorManage/biz/sql/delete`;

// 数据库监控项预览
export const metricPreview = `${appConfig.apiPrefix}/monitorManage/biz/sql/metricPreview`;

// 创建业务报警规则
export const rulesCreate = `${appConfig.apiPrefix}/monitorManage/rules/create`;

// 查询业务报警规则
export const rulesList = `${appConfig.apiPrefix}/monitorManage/rules/list`;

// 查询业务报警规则
export const rulesUpdate = `${appConfig.apiPrefix}/monitorManage/rules/update`;

// 报警分类
export const queryGroupList = `${appConfig.apiPrefix}/monitorManage/rules/group/list`;

// 删除报警
export const deleteRules = `${appConfig.apiPrefix}/monitorManage/rules/delete`;

// 启用禁用报警
export const ruleSwitch = `${appConfig.apiPrefix}/monitorManage/rules/switch`;

// 获取Prometheus监控列表
export const queryPrometheusList = `${appConfig.apiPrefix}/monitorManage/serviceMonitor/list`;

// 删除Prometheus
export const deletePrometheus = `${appConfig.apiPrefix}/monitorManage/serviceMonitor/delete`;

// 创建Prometheus
export const createPrometheus = `${appConfig.apiPrefix}/monitorManage/serviceMonitor/create`;

// 编辑Prometheus
export const updatePrometheus = `${appConfig.apiPrefix}/monitorManage/serviceMonitor/update`;

// 日志级接入列表
export const logList = `${appConfig.apiPrefix}/monitorManage/biz/log/list`;

// 日志级监控接入-新增监控
export const logAdd = `${appConfig.apiPrefix}/monitorManage/biz/log/add`;

// 日志级监控接入-删除监控
export const logDelete = `${appConfig.apiPrefix}/monitorManage/biz/log/delete`;
