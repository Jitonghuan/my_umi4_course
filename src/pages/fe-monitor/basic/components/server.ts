import { getRequest } from '@/utils/request';

/** 总览 */
export const queryOverview = async (data: any) => {
  return getRequest('', data);
};

/** 错误列表 */
export const queryErrorList = async (data: any) => {
  return getRequest('', data);
};
