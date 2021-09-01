import { postRequest, getRequest, putRequest } from '@/utils/request';
import ds from '@config/defaultSettings';
import { AppItemVO } from '../../interfaces';

export const createAppUrl = `${ds.apiPrefix}/appManage/create`;
export const updateAppUrl = `${ds.apiPrefix}/appManage/update`;
export const searchGitAddressUrl = `${ds.apiPrefix}/appManage/searchGitAddress`;

/** 新建应用 */
export const createApp = (params: AppItemVO) => postRequest(createAppUrl, { data: params });

/** 编辑应用 */
export const updateApp = (params: AppItemVO) => putRequest(updateAppUrl, { data: params });

/** 搜索 git 仓库 */
export const searchGitAddress = async (keyword: string) => {
  if (!keyword) return [];

  const result = await getRequest(searchGitAddressUrl, {
    data: {
      key: keyword,
      pageIndex: 1,
      pageSize: 20,
    },
  });
  const { dataSource } = result.data || {};
  return (dataSource || []).map((str: string) => ({ label: str, value: str })) as IOption[];
};
