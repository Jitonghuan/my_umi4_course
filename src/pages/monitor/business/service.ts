import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';
/* 1、POST 新增业务监控 */
export const addMonitor = `${appConfig.apiPrefix}/monitorManage/biz/addMonitor`;
/* 2、PUT 修改业务监控 */
export const updateMonitor = `${appConfig.apiPrefix}/monitorManage/biz/updateMonitor`;
/* 3、DELETE 删除业务监控 */
export const delMonitor = `${appConfig.apiPrefix}/monitorManage/biz/delMonitor`;

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
