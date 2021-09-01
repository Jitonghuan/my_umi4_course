import { getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';

export const searchUserUrl = `${ds.apiPrefix}/appManage/user/list`;

/** 搜索用户：姓名 或 sso账号 */
export const searchUser = async (keyword: string) => {
  if (!keyword) return [];

  keyword = keyword.trim();
  const paramKey = /^\d+$/.test(keyword) ? 'mobile' : /^[\w.-]+$/.test(keyword) ? 'ssoUsername' : 'username';

  const result = await getRequest(searchUserUrl, {
    data: { [paramKey]: keyword },
  });
  const { dataSource } = result.data || {};
  const nameList: string[] = (dataSource || []).map((item: any) => item.username);

  // 结果去重
  return [...new Set(nameList)].map((item) => ({ label: item, value: item })) as IOption[];
};
