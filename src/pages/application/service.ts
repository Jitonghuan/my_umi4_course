import { postRequest, getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';

/**
 * 查询应用列表
 */
export const queryAppsUrl = `${ds.apiPrefix}/appManage/list`;

/** 查询应用列表 */
export const queryApps = (params: {
  /** id */
  id?: number;
  /** 应用CODE */
  appCode?: string;
  /** 应用名称    ---支持模糊搜索 */
  appName?: string;
  /** 应用类型 */
  appType?: 'frontend' | 'backend';
  /** 所属 */
  belong?: string;
  /** 业务线CODE */
  lineCode?: string;
  /** 应用负责人   ---支持模糊搜索 */
  owner?: string;
  /** 分页索引 */
  pageIndex: number;
  /** 分页大小 */
  pageSize: number;
}) =>
  getRequest(queryAppsUrl, { data: params }).then((res: any) => {
    if (res.success) {
      return {
        list: res.data?.dataSource || [],
        ...res.data?.pageInfo,
      };
    }

    return { list: [] };
  });
