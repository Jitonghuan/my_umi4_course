import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

/** 总览 */
export const queryOverview = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/indicatorOverview`, { data: data });
};

/** PV UV趋势图 */
export const pvAndUvChart = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/pvAndUv`, { data: data });
};

/** 错误趋势图 */
export const getErrorChart = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/errorCount`, { data: data });
};

/** 错误列表 */
export const getErrorList = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/pageError`, { data: data });
};

/** 错误详情 */
export const getPageErrorInfo = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/pageErrorInfo`, { data: data });
};
