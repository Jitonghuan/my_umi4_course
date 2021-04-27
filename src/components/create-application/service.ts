import request, { postRequest, getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';
import { FormValue } from './types';

/** 新建应用 */
export const createApp = (params: Omit<FormValue, 'id'>) =>
  postRequest(`${ds.apiPrefix}/appManage/create`, { data: params });

/** 编辑应用 */
export const updateApp = (params: FormValue) =>
  request(`${ds.apiPrefix}/appManage/update`, {
    method: 'PUT',
    data: params,
  });
