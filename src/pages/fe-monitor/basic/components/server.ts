import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

/** 总览 */
export const queryOverview = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/indicatorOverview`, { data: data });
};

export const pvAndUvChart = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/pvAndUv`, { data: data });
};

export const getErrorChart = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/errorCount`, { data: data });
};

/** 错误列表 */
export const getErrorList = async (data: any) => {
  return getRequest(`${appConfig.apiPrefix}/monitorManage/fe/basic/pageError`, { data: data });
};
