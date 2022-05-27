import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

/** 获取envCode */
export const getCommonEnvCode = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/opsManage/multiple/common/getEnvCode`, { data });
};

/** 总览 */
export const queryOverview = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/indicatorOverview`, { data });
};

/** PV UV趋势图 */
export const pvAndUvChart = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/pvAndUv`, { data });
};

/** 错误趋势图 */
export const getErrorChart = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/errorCount`, { data });
};

/** 错误列表 */
export const getErrorList = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/pageError`, { data });
};

/** 错误详情 */
export const getPageErrorInfo = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/pageErrorInfo`, { data });
};

/** 页面汇总性能趋势图 */
export const getPerformanceChart = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/performance/keyIndicator`, { data });
};

/** 页面排行榜 */
export const getPageList = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/performance/pageCountByFilter`, { data });
};

/** 页面指标详情 */
export const getPerformanceDetail = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/performance/pageDetail`, { data });
};

/** API失败接口列表 */
export const getErrorApiList = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/performance/errorApiList`, { data });
};

/** 慢接口列表 */
export const getSlowApiList = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/performance/slowApiList`, { data });
};
