import { postRequest, getRequest, putRequest } from '@/utils/request';
import { AppItemVO } from '../../interfaces';
import { createAppUrl, updateAppUrl, searchGitAddressUrl, queryEnvList } from '../../service';

/** 新建应用 */
export const createApp = (params: AppItemVO) => postRequest(createAppUrl, { data: params });

/** 编辑应用 */
export const updateApp = (params: AppItemVO) => putRequest(updateAppUrl, { data: params });

/** 查看环境 */
export const fetchEnvList = async (data: any) => {
  const result = await getRequest(queryEnvList, {
    data: data,
  });
  const { dataSource } = result.data || {};
  return (dataSource || []).map((item: any) => ({ label: item.envName, value: item.envCode })) as IOption[];
};

/** 搜索 git 仓库 */
export const searchGitAddress = async (keyword: string) => {
  if (!keyword) return [];

  const result = await getRequest(searchGitAddressUrl, {
    data: {
      key: keyword,
      pageIndex: 1,
      pageSize: 100,
    },
  });
  const { dataSource } = result?.data || {};
  return (dataSource || []).map((str: string) => ({ label: str, value: str })) as IOption[];
};
