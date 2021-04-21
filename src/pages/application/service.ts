import request, { postRequest, getRequest } from '@/utils/request';
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
}) =>
  request(`${ds.apiPrefix}/releaseManage/branch/delete`, {
    method: 'DELETE',
    data: params,
  });

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
}) =>
  request(`${ds.apiPrefix}/appManage/member/update`, {
    method: 'PUT',
    data: params,
  });

/** 查看最新版本的配置 */
export const queryConfigListUrl = `${ds.apiPrefix}/appManage/config/listLatest`;
export const queryConfigList = (params: {
  /** 应用CODE */
  appCode: string;
  /** 配置项的KEY */
  key?: string;
  /** TODO 需要这个查询参数 配置项的Value */
  value?: string;
  /** TODO 这个参数用来干嘛的？配置的类型 boot启动参数，app应用配置 */
  type?: string;
  /** 环境参数 */
  env?: string;
  /** 分页索引 */
  pageIndex: number;
  /** 分页大小 */
  pageSize: number;
}) =>
  getRequest(queryConfigListUrl, { data: params }).then((res: any) => {
    if (res.success) {
      return {
        list: res.data?.dataSource?.configs || [],
        ...res.data?.pageInfo,
      };
    }

    return { list: [] };
  });

/** 删除单个配置 */
export const deleteConfig = (id: number) =>
  request(`${ds.apiPrefix}/appManage/config/delete/${id}`, {
    method: 'DELETE',
  });

/** 删除多个配置 */
export const deleteMultipleConfig = (params: { ids: number[] }) =>
  request(`${ds.apiPrefix}/appManage/config/multiDelete`, {
    method: 'DELETE',
    data: params,
  });

/** 新增单个配置 */
export const configAdd = (params: {
  /** 应用CODE */
  appCode: string;
  /** 配置项的KEY */
  key: string;
  /** 配置项的Value */
  value: string;
  /** 环境参数---需要调用基础服务接口获取 */
  env: string;
  /** 配置的类型 boot启动参数，app应用配置 */
  type: string;
}) =>
  postRequest(`${ds.apiPrefix}/appManage/config/add`, {
    data: params,
  });

/** 编辑单个配置 */
export const configUpdate = (params: {
  /** id */
  id: number;
  /** 应用CODE */
  appCode: string;
  /** 配置项的KEY */
  key: string;
  /** 配置项的Value */
  value: string;
  /** 配置的类型 boot启动参数，app应用配置 */
  type: string;
}) =>
  request(`${ds.apiPrefix}/appManage/config/update`, {
    method: 'PUT',
    data: params,
  });

/** 导入配置 */
export const configUploadUrl = `${ds.apiPrefix}/appManage/config/upload`;
export const configUpload = (params: {
  /** 应用CODE */
  appCode: string;
  /** 环境参数---需要调用基础服务接口获取 */
  env: string;
  /** 配置的类型 boot启动参数，app应用配置 */
  type: string;
}) =>
  postRequest(`${ds.apiPrefix}/appManage/config/upload`, {
    data: params,
  });
