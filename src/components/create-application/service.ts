import { postRequest, getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';
import { FormValue } from './types';

/** 新建应用 */
export const createApp = (params: Omit<FormValue, 'id'>) =>
  postRequest(`${ds.apiPrefix}/appManage/create`, { data: params });

/** 编辑应用 */
export const updateApp = (params: FormValue) =>
  // TODO PUT 请求？
  postRequest(`${ds.apiPrefix}/appManage/update`, { data: params });
