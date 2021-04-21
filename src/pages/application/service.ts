import { postRequest, getRequest } from '@/utils/request';
import ds from '@config/defaultSettings';

/** 查询应用列表 */
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

/** 分支列表 */
export const queryBranchListUrl = `${ds.apiPrefix}/releaseManage/branch/list`;

/** 作废分支 */
export const deleteBranch = (params: {
  /** id */
  id: number;
  // TODO DELETE 方法
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/branch/delete`, { data: params });

/** 新增feature分支 */
export const createFeatureBranch = (params: {
  /** 应用CODE */
  appCode: string;
  /** 分支的自定义名称 固定前缀feature_ */
  branchName: string;
  /** 描述 */
  desc: string;
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/branch/createFeature`, {
    data: params,
  });

/** 查询应用成员 */
export const queryAppMember = (params: {
  /** 应用CODE */
  appCode?: string;
}) => getRequest(`${ds.apiPrefix}/appManage/member/list`, { data: params });

/** 编辑应用成员 */
export const updateAppMember = (params: {
  /** 应用CODE */
  appCode: string;
  /** 应用Owner */
  owner?: string;
  /** 开发负责人 */
  developerOwner?: string;
  /** 发布负责人 */
  deployOwner?: string;
  /** code reviewer */
  codeReviewer?: string;
  /** 测试负责 */
  testOwner?: string;
  /** 自动化测试负责人 */
  autoTestOwner?: string;
  /** 报警接收 */
  alterReceiver?: string;
  // TODO PUT 请求
}) => getRequest(`${ds.apiPrefix}/appManage/member/update`, { data: params });
