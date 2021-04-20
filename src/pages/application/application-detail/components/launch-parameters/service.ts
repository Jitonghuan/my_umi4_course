import ds from '@config/defaultSettings';
import { postRequest, getRequest } from '@/utils/request';

/** TODO 新建应用 */
export const createApp = (params: any) =>
  postRequest(`${ds.apiPrefix}/appManage/create`, { data: params });
