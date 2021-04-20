import ds from '@config/defaultSettings';
import { postRequest, getRequest } from '@/utils/request';
import { ConfigData } from './types';

/**
 * TODO 查询发布内容列表
 */
export const queryPublishContentList = `${ds.apiPrefix}/appManage/list`;

/** 新建应用 */
export const createApp = (params: Omit<ConfigData, 'id'>) =>
  postRequest(`${ds.apiPrefix}/appManage/create`, { data: params });

/** 编辑应用 */
export const updateApp = (params: ConfigData) =>
  // TODO PUT 请求？
  postRequest(`${ds.apiPrefix}/appManage/update`, { data: params });
