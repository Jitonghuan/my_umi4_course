import { AppItemVO } from './interfaces';
import { postRequest, getRequest, putRequest, delRequest } from '@/utils/request';
import appConfig from '@/app.config';

/** 查看应用分类接口 */
export const appTypeList = `${appConfig.apiPrefix}/appManage/category/list`;

/** 获取应用环境 */
export const listAppEnv = `${appConfig.apiPrefix}/appManage/env/listAppEnv`;

/** 编辑环境 */
export const updateAppApply = `${appConfig.apiPrefix}/appManage/env/appApply`;

/** 获取部署的下一个环境 */
export const checkNextEnv = `${appConfig.apiPrefix}/releaseManage/deploy/checkNextEnv`;
/** 应用绑定环境 */
export const addAppEnv = `${appConfig.apiPrefix}/appManage/env/addAppEnv`;

/** 应用删除环境 */
export const delAppEnv = `${appConfig.apiPrefix}/appManage/env/delAppEnv`;

/** 查看环境 */
export const queryEnvList = `${appConfig.apiPrefix}/appManage/env/list`;

/** 开启codeReview */
export const envAppCR = `${appConfig.apiPrefix}/appManage/env/appCR`;

/** 查询应用列表 */
export const queryAppsUrl = `${appConfig.apiPrefix}/appManage/list`;

/** GET 查询我的应用列表 */
export const queryMyAppsUrl = `${appConfig.apiPrefix}/appManage/listMyApp`;

/** GET 查询我的收藏应用列表 */
export const queryMyCollectUrl = `${appConfig.apiPrefix}/userManage/userCollection/listMyCollection`;

/** GET 新增收藏 */
export const addCollection = `${appConfig.apiPrefix}/userManage/userCollection/add`;

/** GET 取消收藏 */
export const cancelCollection = `${appConfig.apiPrefix}/userManage/userCollection/cancel`;

/** GET 获取分支列表 */
export const queryBranchListUrl = `${appConfig.apiPrefix}/releaseManage/branch/list`;

/** POST 新增 feature 分支 */
export const createFeatureBranchUrl = `${appConfig.apiPrefix}/releaseManage/branch/createFeature`;

/** POST 新增 主干 分支 */
export const createMasterBranchUrl = `${appConfig.apiPrefix}/releaseManage/branch/createMainBranch`;

/** GET 查询应用成员 */
export const queryAppMemberUrl = `${appConfig.apiPrefix}/appManage/member/list`;

/** PUT 编辑应用成员 */
export const updateAppMemberUrl = `${appConfig.apiPrefix}/appManage/member/update`;

/** DELETE 删除多个配置 */
export const deleteMultipleConfigUrl = `${appConfig.apiPrefix}/appManage/config/multiDelete`;

/** POST 新增单个配置 */
export const configAddUrl = `${appConfig.apiPrefix}/appManage/config/add`;

/** POST 新增多个配置 */
export const configMultiAddUrl = `${appConfig.apiPrefix}/appManage/config/multiAdd`;

/** PUT 编辑单个配置 */
export const configUpdateUrl = `${appConfig.apiPrefix}/appManage/config/update`;

/** GET 查看feature部署情况 */
export const queryFeatureDeployedUrl = `${appConfig.apiPrefix}/releaseManage/branch/featureDeployed`;

/** GET 查询依赖检测校验结果 */
export const checkResultUrl = `${appConfig.apiPrefix}/appManage/dependencyManage/checkResult`;

/** POST 创建部署 */
export const createDeployUrl = `${appConfig.apiPrefix}/releaseManage/deploy/create`;

/** POST 退出 */
export const withdrawFeaturesUrl = `${appConfig.apiPrefix}/releaseManage/deploy/withdrawFeatures`;

/** POST 重新提交分支 */
export const reCommitUrl = `${appConfig.apiPrefix}/releaseManage/deploy/reCommit`;

/** POST 追加分支 */
export const updateFeaturesUrl = `${appConfig.apiPrefix}/releaseManage/deploy/updateFeatures`;

/** POST 重试合并 */
export const retryMergeUrl = `${appConfig.apiPrefix}/releaseManage/merge/retry`;

/** POST 重新构建 */
export const retryBuildUrl = `${appConfig.apiPrefix}/releaseManage/deploy/reBuild`;

/** POST 重新部署 */
export const retryDeployUrl = `${appConfig.apiPrefix}/releaseManage/deploy/reDeploy`;

/** POST 生产环境确认部署和继续部署 */
export const confirmProdDeployUrl = `${appConfig.apiPrefix}/releaseManage/deploy/confirmDeploy`;

/** POST Venus分析 */
export const venusAnalyzeUrl = 'http://venus.cfuture.shop/venus-api/v1/app/analysis';

/** POST 重试生产环境合并master */
export const reMergeMasterUrl = `${appConfig.apiPrefix}/releaseManage/deploy/reMergeMaster`;

/** POST 重试生产环境删除feature分支 */
export const retryDelFeatureUrl = `${appConfig.apiPrefix}/releaseManage/deploy/retryDelFeature`;

/** POST 取消部署 */
export const cancelDeployUrl = `${appConfig.apiPrefix}/releaseManage/deploy/cancel`;

/** POST 部署到下一个环境 */
export const deployReuseUrl = `${appConfig.apiPrefix}/releaseManage/deploy/create/reuse`;

/** POST 部署主干分支*/
export const deployMasterUrl = `${appConfig.apiPrefix}/releaseManage/deploy/create/master`;

/** GET 根据应用分类code查询发布环境列表 */
export const queryEnvsReqUrl = `${appConfig.apiPrefix}/appManage/env/listAppEnv`;

/** POST 应用模版-创建模版 NOT USED */
export const createAppTemplate = `${appConfig.apiPrefix}/opsManage/appTemplate/create`;

/** GET 应用模版-查看模版 */
export const tmplList = `${appConfig.apiPrefix}/opsManage/appTemplate/list`;

/** GET 应用模版-获取模版类型 */
export const tmplType = `${appConfig.apiPrefix}/opsManage/appTemplate/listTmplType`;

/** GET 查看最新版本的配置 */
export const queryConfigListUrl = `${appConfig.apiPrefix}/appManage/config/version/listConfig`;

/** POST 导入配置 */
export const configUploadUrl = `${appConfig.apiPrefix}/appManage/config/upload`;

/** GET 下载镜像或资源 */
export const downloadSource = `${appConfig.apiPrefix}/releaseManage/deploy/offlineDownload`;
/** GET 下载资源包 */
// export const downloadResource = `${appConfig.apiPrefix}/releaseManage/deploy/downloadFeResource`;

/** Post 上传镜像*/
// export const offlineDeploy = `${appConfig.apiPrefix}/releaseManage/deploy/offlineDeploy`;

// 离线部署上传资源或镜像
export const feOfflineDeploy = `${appConfig.apiPrefix}/releaseManage/deploy/offlineUpload`;
//离线部署封网检测
export const checkOfflineDeploy = `${appConfig.apiPrefix}/releaseManage/deploy/checkOfflineDeploy`;

/** POST 重启应用 */
export const restartAppUrl = `${appConfig.apiPrefix}/appManage/restart`;

/** GET 获取环境名 */
export const envList = `${appConfig.apiPrefix}/appManage/env/list`;

/** GET 应用模版-查看应用参数 */
export const paramsList = `${appConfig.apiPrefix}/appManage/appTemplate/list`;

/** PUT 应用模版-编辑应用参数 */
export const editParams = `${appConfig.apiPrefix}/appManage/appTemplate/update`;

/** DELETE 应用模版-删除 */
export const deleteTempl = `${appConfig.apiPrefix}/appManage/appTemplate/delete`;

/** POST 新建应用 */
export const createAppUrl = `${appConfig.apiPrefix}/appManage/create`;

/** PUT 编辑应用 */
export const updateAppUrl = `${appConfig.apiPrefix}/appManage/update`;

/** GET 搜索 git 仓库 */
export const searchGitAddressUrl = `${appConfig.apiPrefix}/appManage/searchGitAddress`;

/** POST 创建前端路由模板 */
export const createFeRouteConfig = `${appConfig.apiPrefix}/appManage/feRouteTemplate/create`;

/** GET 查询前端路由模板 */
export const queryFeRouteConfig = `${appConfig.apiPrefix}/appManage/feRouteTemplate/list`;

/** PUT 更新前端路由模板 */
export const updateFeRouteConfig = `${appConfig.apiPrefix}/appManage/feRouteTemplate/update`;

/** GET 查看前端版本 */
export const queryFeVersions = `${appConfig.apiPrefix}/appManage/feVersion/list`;

// ---------- 部署相关接口

/** GET 获取部署信息 */
export const queryDeployListUrl = `${appConfig.apiPrefix}/releaseManage/deploy/list`;

/** 获取应用大类的环境列表 */
export const queryAppEnvs = `${appConfig.apiPrefix}/appManage/env/listAppEnv`;

/** GET 获取应用变更记录列表 */
export const queryRecentChangeOrder = `${appConfig.apiPrefix}/releaseManage/queryRecentChangeOrder`;

export const queryAppOperate = `${appConfig.apiPrefix}/appManage/deployInfo/instance/appOperate`;
/** GET 获取应用运行和变更状态 */
export const queryApplicationStatus = `${appConfig.apiPrefix}/releaseManage/queryApplicationStatus`;

/** GET 获取发布版本历史列表 */
export const queryHistoryVersions = `${appConfig.apiPrefix}/releaseManage/queryHistoryVersions`;

/** POST 发布回滚 */
export const rollbackApplication = `${appConfig.apiPrefix}/releaseManage/rollbackApplication`;

/** POST 应用重启 */
export const restartApplication = `${appConfig.apiPrefix}/releaseManage/restartApplication`;

/** GET 查询项目环境 */
export const queryProjectEnvList = `${appConfig.apiPrefix}/appManage/projectEnv/list`;

/** GET 查询卡点任务结果 */
export const qualityGuardInfo = `${appConfig.apiPrefix}/qc/qualitycontrol/qualityGuardInfo`;

// -------- 前端发布相关接口
/** POST 重试推送资源 */
export const rePushFeResourceUrl = `${appConfig.apiPrefix}/releaseManage/deploy/rePushFeResource`;

/** POST 重试推送前端版本 */
export const rePushFeVersionUrl = `${appConfig.apiPrefix}/releaseManage/deploy/rePushFeVersion`;

/** POST 前端发布验证确认 */
export const fePublishVerifyUrl = `${appConfig.apiPrefix}/releaseManage/deploy/fePublishVerify`;

/** POST 前端版本回滚 */
export const rollbackFeAppUrl = `${appConfig.apiPrefix}/releaseManage/rollbackFeApp`;

/** POST 创建review */
export const createReview = `${appConfig.apiPrefix}/releaseManage/branch/createReview`;

/** POST  获取分支review状态 */
export const getReviewStatus = `${appConfig.apiPrefix}/releaseManage/branch/getReviewStatus`;

/** GET 从regulus列出在线bug列表 */
export const getRegulusOnlineBugs = `${appConfig.apiPrefix}/publishManage/third/regulus/onlineBugs`;

/** GET 从regulus列出project信息 */
export const getRegulusProjects = `${appConfig.apiPrefix}/publishManage/third/regulus/projects`;

let env = appConfig.BUILD_ENV === 'prod' ? 'prod' : 'dev';
/** POST 新建分支关联需求 */
export const queryPortalList = `http://kapi-base-${env}.cfuture.shop/eip-fone/portal/list`;

export const getDemandByProjectList = `http://kapi-base-${env}.cfuture.shop/eip-fone/portal/getDemandByProject`;
// post 新建分支-获取主干分支下拉框数据
export const getMasterBranch = '';

// post 主干分支-新建分支-获取来源分支下拉框数据
export const getOriginBranch = '';

/** GET 当前应用下已通过且存在未上线发布计划的发布申请列表 */
export const applyHaveNoUpPlanList = `${appConfig.apiPrefix}/publishManage/applyHaveNoUpPlan/list`;

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
  return (result?.data?.dataSource || []) as AppItemVO[];
};

/** 删除应用 */
export const deleteApp = (params: {
  /** appCode */
  appCode: string;
  /** id */
  id: string | number;
}) => delRequest(`${appConfig.apiPrefix}/appManage/delete/${params.id}`);

/** 作废分支 */
export const deleteBranch = (params: {
  /** id */
  id: number;
}) =>
  delRequest(`${appConfig.apiPrefix}/releaseManage/branch/delete/${params.id}`, {
    data: params,
  });

/** 新增feature分支 */
export const createFeatureBranch = (params: {
  /** 应用CODE */
  appCode: string;
  /** 选择平台 */
  relatedPlat: string;
  /** 分支的自定义名称 固定前缀feature_ */
  branchName: string;
  /** 描述 */
  desc: string;
  demandId?: any;
  masterBranch: string;
  // 需求列表
}) =>
  postRequest(createFeatureBranchUrl, {
    data: params,
  });

// 新建主干分支
export const createMasterBranch = (params: any) => postRequest(createMasterBranchUrl, { data: params });

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
  appCode?: string;
  /** 环境参数 */
  envCode?: string;
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
export const deleteConfig = (id: number) => delRequest(`${appConfig.apiPrefix}/appManage/config/delete/${id}`);

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

export const queryDeployInfoUrl = `${appConfig.apiPrefix}/releaseManage/deploy/getActiveDeployInfo`;

export const queryActiveDeployInfo = async (params: any) => {
  return getRequest(queryDeployInfoUrl, {
    data: params,
  });
};

export const queryNewDeployInfoUrl = `v2/releaseManage/deploy/getActiveDeployInfo`;
export const getNewDeployInfo = async (params: any) => {
  return getRequest(queryNewDeployInfoUrl, {
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
  pipelineCode?: string;
  masterBranch?: string;
  isNpm?: boolean;
  needRelationInfo: number
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
  /** PDA 打包方式 apk bundles */
  pdaDeployType?: string;
  /** 发布环境code */
  envCodes?: string[];
  pipelineCode?: string;
  /** 是否是二方包*/
  // isClient: boolean;
  masterBranch?: string;
  buildType?: string;
  deployModel: string;
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

/** 重新提交 */
export const reCommit = (params: {
  /** 部署的数据库自增ID */
  id: number;
  /** 选择的feature分支 */
  features: string[];
}) =>
  postRequest(reCommitUrl, {
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

// 退出分支
export const withdrawFeatures = (params: { id: number; features: any }) =>
  postRequest(withdrawFeaturesUrl, {
    data: params,
    hideToast: true,
  });

/** 重新构建 */
export const retryBuild = (params: {
  /** 部署的数据库自增ID */
  id: number;
  envCode: string;
}) =>
  postRequest(retryBuildUrl, {
    data: params,
  });

/** 重新部署 */
export const retryDeploy = (params: {
  /** 部署的数据库自增ID */
  id: number;
  envCode?: string;
}) =>
  postRequest(retryDeployUrl, {
    data: params,
  });

export const retryUrl = `${appConfig.apiPrefix}/releaseManage/deploy/retry`;

/** 重试 */
export const retry = (params: {
  /** 部署的数据库自增ID */
  id: number;
  envCode?: string;
}) =>
  postRequest(retryUrl, {
    data: params,
  });

export const confirmDeployUrl = `${appConfig.apiPrefix}/releaseManage/deploy/confirmDeploy`;

/** 生产环境确认部署和继续部署 */
export const confirmDeploy = (params: {
  /** 部署的数据库自增ID */
  id: number;
  /** 发布机构: tian/weishan */
  // hospital: string;
  /** 发布批次，0不分批，1发布第一批，2发布第二批 */
  // deployingBatch: 0 | 1 | 2;
  deployingBatch: number;
  applyIds: any;
  envCode: string;
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

/** Venus分析 */
export const venusAnalyze = (params: { appCode: any; gitUrl: any }) =>
  postRequest(venusAnalyzeUrl, {
    data: params,
    hideToast: true,
  });

/** 取消部署 */
export const cancelDeploy = (params: {
  /** 部署的数据库自增ID */
  id: number;
  envCode?: string;
}) =>
  postRequest(cancelDeployUrl, {
    data: params,
  });

/** 部署到下个环境 */
export const deployReuse = (params: {
  /** 部署的数据库自增ID */
  id?: number;
  /** poc环境复用到生产环境需要 */
  envs?: string[];
  envCodes?: any;
  pipelineCode?: string;
  reusePipelineCode?: string;
}) =>
  postRequest(deployReuseUrl, {
    data: params,
  });

/** 部署master*/
export const deployMaster = (params: {
  /** 应用code */
  appCode?: string;
  envTypeCode?: string;
  pipelineCode: string;
  envCodes?: any;
  buildType?: string;
  masterBranch?: string; //主干分支
  deployModel?: string;
}) =>
  postRequest(deployMasterUrl, {
    data: params,
  });

/** 根据应用分类code查询发布环境列表 */
export const queryEnvsReq = (params: {
  //所属的应⽤分类CODE
  categoryCode?: string;
  // 当前所处环境
  envTypeCode?: string;
  //AppCode
  appCode: string | undefined;
}) =>
  getRequest(queryEnvsReqUrl, {
    data: {
      ...params,
      pageIndex: -1,
      pageSize: 100,
    },
  }).then((res: any) => {
    if (res?.success) {
      return {
        list:
          res.data?.map((el: any) => {
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

/** POST 重试推送资源 */
export const rePushFeResource = async (data: any) => postRequest(rePushFeResourceUrl, { data });

/** POST 重试推送前端版本 */
export const rePushFeVersion = async (data: any) => postRequest(rePushFeVersionUrl, { data });

/** POST 前端发布验证确认 */
export const fePublishVerify = async (data: any) => postRequest(fePublishVerifyUrl, { data });

/** POST 前端版本回滚 */
export const rollbackFeApp = async (data: any) => postRequest(rollbackFeAppUrl, { data });

/** POST 创建review */
// export const createReview = async (data: any) => postRequest(createReviewUrl, { data });

/** POST 获取分支review状态 */
// export const getReviewStatus = async (data: any) => postRequest(getReviewStatusUrl, { data });

/** GET 解决冲突-获取冲突信息 */
export const getMergeMessageUrl = `${appConfig.apiPrefix}/releaseManage/mergeRequest/getChanges`;
export const getMergeMessage = async (params: any) => await getRequest(getMergeMessageUrl, { data: params });

/** POST 解决冲突-提交冲突 */
export const pushMergeMessageUrl = `${appConfig.apiPrefix}/releaseManage/mergeRequest/commit`;
export const pushMergeMessage = async (params: any) => await postRequest(pushMergeMessageUrl, { data: params });

/** GET 应用部署-获取流水线 */
export const getPipelineUrl = `${appConfig.apiPrefix}/appManage/appPipeline/list`;
// export const getPipelineUrl = `http://127.0.0.1:4523/mock/837336/v1/appManage/appPipeline/list`;

/** POST 应用部署-新增流水线 */
export const addPipelineUrl = `${appConfig.apiPrefix}/appManage/appPipeline/create`;

/** POST 应用部署-编辑流水线 */
export const updatePipelineUrl = `${appConfig.apiPrefix}/appManage/appPipeline/update`;

/** 删除流水线 */
export const deletePipeline = (params: { pipelineCode: string }) =>
  delRequest(`${appConfig.apiPrefix}/releaseManageappManage/appPipeline/delete/${params.pipelineCode}`, {
    data: params,
  });


/** 是否要用新的发布步骤条 */
export const judgeIsNew = (params: any) =>
  getRequest(`${appConfig.apiPrefix}/releaseManageappManage/appPipeline/delete/${params.pipelineCode}`, {
    data: params,
  });

