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
  /** 应用分类 */
  categoryCode?: string;
  /** 应用组CODE */
  groupCode?: string;
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

/** 删除应用 */
export const deleteApp = (params: {
  /** appCode */
  appCode: string;
  /** id */
  id: string | number;
}) =>
  request(`${ds.apiPrefix}/appManage/delete/${params.id}`, {
    method: 'DELETE',
    // data: params,
  });

/** 分支列表 */
export const queryBranchListUrl = `${ds.apiPrefix}/releaseManage/branch/list`;

/** 作废分支 */
export const deleteBranch = (params: {
  /** id */
  id: number;
}) =>
  request(`${ds.apiPrefix}/releaseManage/branch/delete/${params.id}`, {
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
export const queryConfigListUrl = `${ds.apiPrefix}/appManage/config/version/listConfig`;
export const queryConfigList = (params: {
  /** 应用CODE */
  appCode: string;
  /** 配置项的KEY */
  key?: string;
  /**  配置项的Value */
  value?: string;
  /** 配置的类型 boot启动参数，app应用配置 */
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
  type: 'boot' | 'app';
}) =>
  postRequest(`${ds.apiPrefix}/appManage/config/add`, {
    data: params,
  });

/** 新增多个配置 */
export const configMultiAdd = (params: {
  /** 应用CODE */
  appCode: string;
  /** 环境参数---需要调用基础服务接口获取 */
  env: string;
  /** 配置的类型 boot启动参数，app应用配置 */
  type: 'boot' | 'app';
  /** 多个配置 */
  configs: Array<{
    /** 应用CODE */
    appCode: string;
    /** 环境参数---需要调用基础服务接口获取 */
    env: string;
    /** 配置的类型 boot启动参数，app应用配置 */
    type: 'boot' | 'app';
    /** 配置项的KEY */
    key: string;
    /** 配置项的Value */
    value: string;
  }>;
}) =>
  postRequest(`${ds.apiPrefix}/appManage/config/multiAdd`, {
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
  type: 'boot' | 'app';
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
  type: 'boot' | 'app';
}) =>
  postRequest(`${ds.apiPrefix}/appManage/config/upload`, {
    data: params,
  });

/** 查看部署 */
export const queryDeployList = async (params: {
  /** 应用CODE */
  appCode: string;
  /** 环境参数---需要调用基础服务接口获取 */
  envTypeCode: string;
  /** 0否/1是    默认每个应用每个环境只有一个 */
  isActive: 0 | 1;
  /** 分页索引 */
  pageIndex: number;
  /** 分页大小 */
  pageSize: number;
}) => {
  console.log(222);
  return getRequest(`${ds.apiPrefix}/releaseManage/deploy/list`, {
    data: params,
  });
};

// .then((res: any) => {
//   if (res.success) {
//     return {
//       list: res.data?.dataSource || [],
//       ...res.data?.pageInfo,
//     };
//   }

//   return { list: [] };
// });

/** 查看feature部署情况 */
export const queryFeatureDeployed = async (params: {
  /** 应用CODE */
  appCode: string;
  /** 环境参数---需要调用基础服务接口获取 */
  envTypeCode: string;
  /** 1已部署，0未部署 */
  isDeployed?: 0 | 1;
}) => {
  return getRequest(`${ds.apiPrefix}/releaseManage/branch/featureDeployed`, {
    data: params,
  });
};

/** 创建部署 */
export const createDeploy = (params: {
  /** 应用CODE */
  appCode: string;
  /** 环境参数---需要调用基础服务接口获取 */
  envTypeCode: string;
  /** 选择的feature分支 */
  features: string[];
  /** 发布环境code */
  envCodes?: string[];
  /** 是否是二方包*/
  isClient: boolean;
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/deploy/create`, {
    data: params,
  });

/** 追加发布的feature列表 */
export const updateFeatures = (params: {
  /** 部署的数据库自增ID */
  id: number;
  /** 选择的feature分支 */
  features: string[];
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/deploy/updateFeatures`, {
    data: params,
  });

/** 重试合并 */
export const retryMerge = (params: {
  /** 部署的数据库自增ID */
  id: string;
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/merge/retry`, {
    data: params,
  });

/** 重新部署 */
export const retryDeploy = (params: {
  /** 部署的数据库自增ID */
  id: string;
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/deploy/reDeploy`, {
    data: params,
  });

/** 生产环境确认部署和继续部署 */
export const confirmProdDeploy = (params: {
  /** 部署的数据库自增ID */
  id: string;
  /** 发布机构: tian/weishan */
  hospital: string;
  /** 发布批次，0不分批，1发布第一批，2发布第二批 */
  batch: 0 | 1 | 2;
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/deploy/confirmProd`, {
    data: params,
  });

/** 重试生产环境合并master */
export const reMergeMaster = (params: {
  /** 部署的数据库自增ID */
  id: string;
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/deploy/reMergeMaster`, {
    data: params,
  });

/** 重试生产环境删除feature分支 */
export const retryDelFeature = (params: {
  /** 部署的数据库自增ID */
  id: string;
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/deploy/retryDelFeature`, {
    data: params,
  });

/** 取消部署 */
export const cancelDeploy = (params: {
  /** 部署的数据库自增ID */
  id: string;
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/deploy/cancel`, {
    data: params,
  });

/** 复用release分支 */
export const deployReuse = (params: {
  /** 部署的数据库自增ID */
  id: string;
  /** poc环境复用到生产环境需要 */
  hospitals?: string[];
}) =>
  postRequest(`${ds.apiPrefix}/releaseManage/deploy/reuse`, {
    data: params,
  });

/** 根据应用分类code查询发布环境列表 */
const queryEnvsUrl = `${ds.apiPrefix}/appManage/env/list`;
export const queryEnvsReq = (params: {
  //所属的应⽤分类CODE
  categoryCode: string;
  // 当前所处环境
  envTypeCode: string;
}) =>
  getRequest(queryEnvsUrl, {
    data: {
      ...params,
      pageIndex: -1,
      pageSize: 100,
    },
  }).then((res: any) => {
    if (res.success) {
      return {
        list:
          res.data?.dataSource?.map((el: any) => {
            return {
              ...el,
              value: el.envCode,
              label: el.envName,
            };
          }) || [],
        // ...res.data?.pageInfo,
      };
    }

    return { list: [] };
  });
