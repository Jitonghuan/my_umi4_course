import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';

// 创建npm包
export const npmCreate = `${appConfig.apiPrefix}/appManage/npm/create`;

// 删除npm包
export const npmDelete = `${appConfig.apiPrefix}/appManage/npm/delete`;

// 修改npm包
export const npmUpdate = `${appConfig.apiPrefix}/appManage/npm/update`;

// npm列表
export const npmList = `${appConfig.apiPrefix}/appManage/npm/list`;

//  搜索 git 仓库
export const searchGitAddressUrl = `${appConfig.apiPrefix}/appManage/searchGitAddress`;

/** 搜索 git 仓库 */
export const searchGitAddress = async (keyword: string) => {
  if (!keyword) return [];

  const result = await getRequest(searchGitAddressUrl, {
    data: {
      key: keyword,
      pageIndex: 1,
      pageSize: 60,
    },
  });
  const { dataSource } = result.data || {};
  return (dataSource || []).map((str: string) => ({ label: str, value: str })) as IOption[];
};
