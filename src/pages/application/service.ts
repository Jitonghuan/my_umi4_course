import { AppItemVO } from './interfaces';
import { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import ds from '@config/defaultSettings';

/** 查询应用列表 */
export const queryAppsUrl = `${ds.apiPrefix}/appManage/list`;

/** GET 查询我的应用列表 */
export const queryMyAppsUrl = `${ds.apiPrefix}/appManage/listMyApp`;

/** GET 获取分支列表 */
export const queryBranchListUrl = `${ds.apiPrefix}/releaseManage/branch/list`;

/** POST 新增 feature 分支 */
export const createFeatureBranchUrl = `${ds.apiPrefix}/releaseManage/branch/createFeature`;

/** GET 查询应用成员 */
export const queryAppMemberUrl = `${ds.apiPrefix}/appManage/member/list`;

/** PUT 编辑应用成员 */
export const updateAppMemberUrl = `${ds.apiPrefix}/appManage/member/update`;

/** DELETE 删除多个配置 */
export const deleteMultipleConfigUrl = `${ds.apiPrefix}/appManage/config/multiDelete`;

/** POST 新增单个配置 */
export const configAddUrl = `${ds.apiPrefix}/appManage/config/add`;

/** POST 新增多个配置 */
export const configMultiAddUrl = `${ds.apiPrefix}/appManage/config/multiAdd`;

/** PUT 编辑单个配置 */
export const configUpdateUrl = `${ds.apiPrefix}/appManage/config/update`;

/** GET 查看feature部署情况 */
export const queryFeatureDeployedUrl = `${ds.apiPrefix}/releaseManage/branch/featureDeployed`;

/** POST 创建部署 */
export const createDeployUrl = `${ds.apiPrefix}/releaseManage/deploy/create`;

/** POST 追加发布的feature列表 */
export const updateFeaturesUrl = `${ds.apiPrefix}/releaseManage/deploy/updateFeatures`;

/** POST 重试合并 */
export const retryMergeUrl = `${ds.apiPrefix}/releaseManage/merge/retry`;

/** POST 重新构建 */
export const retryBuildUrl = `${ds.apiPrefix}/releaseManage/deploy/reBuild`;

/** POST 重新部署 */
export const retryDeployUrl = `${ds.apiPrefix}/releaseManage/deploy/reDeploy`;

/** POST 生产环境确认部署和继续部署 */
export const confirmProdDeployUrl = `${ds.apiPrefix}/releaseManage/deploy/confirmProd`;

/** POST 重试生产环境合并master */
export const reMergeMasterUrl = `${ds.apiPrefix}/releaseManage/deploy/reMergeMaster`;

/** POST 重试生产环境删除feature分支 */
export const retryDelFeatureUrl = `${ds.apiPrefix}/releaseManage/deploy/retryDelFeature`;

/** POST 取消部署 */
export const cancelDeployUrl = `${ds.apiPrefix}/releaseManage/deploy/cancel`;

/** POST 复用release分支 */
export const deployReuseUrl = `${ds.apiPrefix}/releaseManage/deploy/reuse`;

/** POST 部署master*/
export const deployMasterUrl = `${ds.apiPrefix}/releaseManage/deploy/deployMaster`;

/** GET 根据应用分类code查询发布环境列表 */
export const queryEnvsReqUrl = `${ds.apiPrefix}/appManage/env/list`;

/** POST 应用模版-创建模版 NOT USED */
export const createAppTemplate = `${ds.apiPrefix}/opsManage/appTemplate/create`;

/** GET 应用模版-查看模版 */
export const tmplList = `${ds.apiPrefix}/opsManage/appTemplate/list`;

/** GET 应用模版-获取模版类型 */
export const tmplType = `${ds.apiPrefix}/opsManage/appTemplate/listTmplType`;

/** GET 查看最新版本的配置 */
export const queryConfigListUrl = `${ds.apiPrefix}/appManage/config/version/listConfig`;

/** POST 导入配置 */
export const configUploadUrl = `${ds.apiPrefix}/appManage/config/upload`;

/** GET 下载镜像 */
export const downloadImage = `${ds.apiPrefix}/releaseManage/deploy/downloadImage`;
/** Post 上传镜像*/
export const offlineDeploy = `${ds.apiPrefix}/releaseManage/deploy/offlineDeploy`;

/** POST 重启应用 */
export const restartAppUrl = `${ds.apiPrefix}/appManage/restart`;

/** GET 获取环境名 */
export const envList = `${ds.apiPrefix}/appManage/env/list`;

/** GET 应用模版-查看应用参数 */
export const paramsList = `${ds.apiPrefix}/appManage/appTemplate/list`;

/** PUT 应用模版-编辑应用参数 */
export const editParams = `${ds.apiPrefix}/appManage/appTemplate/update`;

/** POST 新建应用 */
export const createAppUrl = `${ds.apiPrefix}/appManage/create`;

/** PUT 编辑应用 */
export const updateAppUrl = `${ds.apiPrefix}/appManage/update`;

/** GET 搜索 git 仓库 */
export const searchGitAddressUrl = `${ds.apiPrefix}/appManage/searchGitAddress`;

/** POST 创建前端路由模板 */
export const createFeRouteTemplate = `${ds.apiPrefix}/appManage/feRouteTemplate/create`;

/** GET 查询前端路由模板 */
export const queryFeRouteTemplate = `${ds.apiPrefix}/appManage/feRouteTemplate/list`;

/** PUT 更新前端路由模板 */
export const updateFeRouteTemplate = `${ds.apiPrefix}/appManage/feRouteTemplate/update`;

/** GET 查看前端版本 */
export const queryFeVersions = `${ds.apiPrefix}/appManage/feVersion/list`;

// ---------- 部署相关接口

/** GET 获取部署信息 */
export const queryDeployListUrl = `${ds.apiPrefix}/releaseManage/deploy/list`;

/** 获取应用大类的环境列表 */
export const queryAppEnvs = `${ds.apiPrefix}/monitorManage/app/env`;

/** GET 获取应用变更记录列表 */
export const queryRecentChangeOrder = `${ds.apiPrefix}/releaseManage/queryRecentChangeOrder`;

/** GET 获取应用运行和变更状态 */
export const queryApplicationStatus = `${ds.apiPrefix}/releaseManage/queryApplicationStatus`;

/** GET 获取发布版本历史列表 */
export const queryHistoryVersions = `${ds.apiPrefix}/releaseManage/queryHistoryVersions`;

/** POST 发布回滚 */
export const rollbackApplication = `${ds.apiPrefix}/releaseManage/rollbackApplication`;

/** POST 应用重启 */
export const restartApplication = `${ds.apiPrefix}/releaseManage/restartApplication`;

/** GET 查询卡点任务结果 */
export const qualityGuardInfo = `${ds.apiPrefix}/qc/qualitycontrol/qualityGuardInfo`;

/** 查询应用列表 (返回的数据没有分页) */
export const queryApps = async (
  params: Partial<AppItemVO> & {
    /** 分页索引 */
    pageIndex: number;
    /** 分页大小 */
    pageSize: number;
    /** 请求类型 */
    requestType?: 'all' | 'mine';
  },
) => {
  const { requestType, ...data } = params;
  const result = await getRequest(requestType === 'mine' ? queryMyAppsUrl : queryAppsUrl, { data });
  return (result.data?.dataSource || []) as AppItemVO[];
};

/** 删除应用 */
export const deleteApp = (params: {
  /** appCode */
  appCode: string;
  /** id */
  id: string | number;
}) => delRequest(`${ds.apiPrefix}/appManage/delete/${params.id}`);

/** 作废分支 */
export const deleteBranch = (params: {
  /** id */
  id: number;
}) =>
  delRequest(`${ds.apiPrefix}/releaseManage/branch/delete/${params.id}`, {
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
  postRequest(createFeatureBranchUrl, {
    data: params,
  });

/** 查询应用成员 */
export const queryAppMember = (params: { appCode?: string }) => getRequest(queryAppMemberUrl, { data: params });

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
  putRequest(updateAppMemberUrl, {
    data: params,
  });

/** 查看最新版本的配置 */
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
export const deleteConfig = (id: number) => delRequest(`${ds.apiPrefix}/appManage/config/delete/${id}`);

/** 删除多个配置 */
export const deleteMultipleConfig = (params: { ids: number[] }) =>
  delRequest(deleteMultipleConfigUrl, {
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
  postRequest(configAddUrl, {
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
  postRequest(configMultiAddUrl, {
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
  putRequest(configUpdateUrl, {
    data: params,
  });

/** 导入配置 */
export const configUpload = (params: {
  /** 应用CODE */
  appCode: string;
  /** 环境参数---需要调用基础服务接口获取 */
  env: string;
  /** 配置的类型 boot启动参数，app应用配置 */
  type: 'boot' | 'app';
}) =>
  postRequest(configUploadUrl, {
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
  return getRequest(queryDeployListUrl, {
    data: params,
  });
};

/** 查看feature部署情况 */
export const queryFeatureDeployed = async (params: {
  /** 应用CODE */
  appCode: string;
  /** 环境参数---需要调用基础服务接口获取 */
  envTypeCode: string;
  /** 1已部署，0未部署 */
  isDeployed?: 0 | 1;
  /** 分支名 */
  branchName?: string;
}) => {
  return getRequest(queryFeatureDeployedUrl, {
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
  postRequest(createDeployUrl, {
    data: params,
  });

/** 追加发布的feature列表 */
export const updateFeatures = (params: {
  /** 部署的数据库自增ID */
  id: number;
  /** 选择的feature分支 */
  features: string[];
}) =>
  postRequest(updateFeaturesUrl, {
    data: params,
  });

/** 重试合并 */
export const retryMerge = (params: {
  /** 部署的数据库自增ID */
  id: number;
}) =>
  postRequest(retryMergeUrl, {
    data: params,
  });

/** 重新构建 */
export const retryBuild = (params: {
  /** 部署的数据库自增ID */
  id: number;
}) =>
  postRequest(retryBuildUrl, {
    data: params,
  });

/** 重新部署 */
export const retryDeploy = (params: {
  /** 部署的数据库自增ID */
  id: number;
}) =>
  postRequest(retryDeployUrl, {
    data: params,
  });

/** 生产环境确认部署和继续部署 */
export const confirmProdDeploy = (params: {
  /** 部署的数据库自增ID */
  id: number;
  /** 发布机构: tian/weishan */
  hospital: string;
  /** 发布批次，0不分批，1发布第一批，2发布第二批 */
  batch: 0 | 1 | 2;
}) =>
  postRequest(confirmProdDeployUrl, {
    data: params,
  });

/** 重试生产环境合并master */
export const reMergeMaster = (params: {
  /** 部署的数据库自增ID */
  id: number;
}) =>
  postRequest(reMergeMasterUrl, {
    data: params,
  });

/** 重试生产环境删除feature分支 */
export const retryDelFeature = (params: {
  /** 部署的数据库自增ID */
  id: number;
}) =>
  postRequest(retryDelFeatureUrl, {
    data: params,
  });

/** 取消部署 */
export const cancelDeploy = (params: {
  /** 部署的数据库自增ID */
  id: number;
}) =>
  postRequest(cancelDeployUrl, {
    data: params,
  });

/** 复用release分支 */
export const deployReuse = (params: {
  /** 部署的数据库自增ID */
  id: number;
  /** poc环境复用到生产环境需要 */
  envs?: string[];
}) =>
  postRequest(deployReuseUrl, {
    data: params,
  });

/** 部署master*/
export const deployMaster = (params: {
  /** 应用code */
  appCode?: string;
  envTypeCode?: string;
  envCodes?: string[];
  isClient?: boolean;
}) =>
  postRequest(deployMasterUrl, {
    data: params,
  });

/** 根据应用分类code查询发布环境列表 */
export const queryEnvsReq = (params: {
  //所属的应⽤分类CODE
  categoryCode: string;
  // 当前所处环境
  envTypeCode?: string;
}) =>
  getRequest(queryEnvsReqUrl, {
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

/** 重启应用 */
export const restartApp = async (data: any) => postRequest(restartAppUrl, { data });
