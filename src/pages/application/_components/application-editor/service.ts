import { postRequest, getRequest, putRequest } from '@/utils/request';
import ds from '@config/defaultSettings';
import { FormValue } from './types';

/** 新建应用 */
export const createApp = (params: Omit<FormValue, 'id'>) =>
  postRequest(`${ds.apiPrefix}/appManage/create`, { data: params });

/** 编辑应用 */
export const updateApp = (params: FormValue) =>
  putRequest(`${ds.apiPrefix}/appManage/update`, {
    data: params,
  });
