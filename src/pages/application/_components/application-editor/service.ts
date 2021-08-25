import { postRequest, getRequest, putRequest } from '@/utils/request';
import ds from '@config/defaultSettings';
import { AppItemVO } from '../../interfaces';

/** 新建应用 */
export const createApp = (params: AppItemVO) => postRequest(`${ds.apiPrefix}/appManage/create`, { data: params });

/** 编辑应用 */
export const updateApp = (params: AppItemVO) =>
  putRequest(`${ds.apiPrefix}/appManage/update`, {
    data: params,
  });
