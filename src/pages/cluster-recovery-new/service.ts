// api list
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/11/24 10:37
// https://come-future.yuque.com/sekh46/bbgc7f/vlkirb#oRCTM

import { addAPIPrefix } from '@/utils';
import appConfig from "@/app.config";
import { getRequest } from "@/utils/request";


/** GET 流量地图 */
export const trafficMap = addAPIPrefix('/opsManage/multiple/map');

/** POST 集群维度流量调度通用接口 */
export const switchCluster = addAPIPrefix('/opsManage/multiple/common/switchCluster');

// A、B集群用户和操作员查询
export const listClusterUser = addAPIPrefix('/opsManage/multiple/common/getMultipleClusterUser');
// A、B集群患或操作员新增
export const addMultipleClusterUser = addAPIPrefix('/opsManage/multiple/common/MultipleClusterByUser');

/** GET 操作日志查询 */
export const queryOperateLog = addAPIPrefix('/opsManage/multiple/queryOperateLog');

/** GET 集群应用比对 */
export const diffClusterApp = addAPIPrefix('/opsManage/k8s/multiple/diffClusterApp');

/** GET 集群应用同步查询 */
export const queryClusterApp = addAPIPrefix('/opsManage/k8s/multiple/queryClusterApp');

/** POST 集群应用同步 */
export const syncClusterApp = addAPIPrefix('/opsManage/k8s/multiple/syncClusterApp');

/** GET Nacos配置比对 */
export const configDiff = addAPIPrefix('/opsManage/k8s/multiple/configDiff');

/** POST Nacos同步 */
export const syncConfig = addAPIPrefix('/opsManage/k8s/multiple/syncConfig');

/** GET XXL-Job比对 */
export const xxlJobDiff = addAPIPrefix('/opsManage/k8s/multiple/xxlJobDiff');

/** POST XXL-Job同步 */
export const syncXxlJob = addAPIPrefix('/opsManage/k8s/multiple/syncXxlJob');

/** POST 前端资源同步 */
export const syncFrontendSource = addAPIPrefix('/opsManage/k8s/multiple/syncFrontendSource');

/** GET 集群同步完成 */
export const syncClusterOver = addAPIPrefix('/opsManage/k8s/multiple/syncClusterOver');

/** GET 任务状态查询 */
export const querySyncState = addAPIPrefix('/opsManage/k8s/multiple/querySyncState');

/** GET 获取天台应用列表 */
export const queryAppList = addAPIPrefix('/opsManage/k8s/multiple/queryAppList');

/** POST 集群同步-单应用比对 */
export const singleDiffApp = addAPIPrefix('opsManage/k8s/multiple/diffApp');

/** POST 集群同步-单应用同步 */
export const syncSingleApp = addAPIPrefix('/opsManage/k8s/multiple/syncSingleApp');

/** GET 获取 dashboard 页面地址 */
export const getDashboardUrl = addAPIPrefix('/opsManage/multiple/getDashboardUrl');

/** GET 获取 获取院区列表 */
export const getHospitalDistrictInfo = addAPIPrefix('/opsManage/multiple/common/getHospitalDistrictInfo');

/** GET 前端集群同步 - 获取前端应用 */
export const getAppList = addAPIPrefix('/appManage/list');

/** GET 前端集群同步 - 前端单应用比对 */
export const diffFeSingleApp = addAPIPrefix('/opsManage/k8s/multiple/diffFeApp');

/** POST 前端集群同步 - 前端单应用同步 */
export const syncSingleFeApp = addAPIPrefix('/opsManage/k8s/multiple/syncFeSingleApp');

/** GET 项目环境 */
export const getCommonEnvCode = addAPIPrefix('/opsManage/multiple/common/getEnvCode');

/** POST 新增机构信息 */
export const addHospitalDistrictInfo = addAPIPrefix('/opsManage/multiple/common/addHospitalDistrictInfo');

/** POST 编辑机构信息 */
export const updateHospitalDistrictInfo = addAPIPrefix('/opsManage/multiple/common/updateHospitalDistrictInfo');

/** POST 编辑机构信息 */
export const deleteHospitalDistrictInfo = addAPIPrefix('/opsManage/multiple/common/deleteHospitalDistrictInfo');

/* ---------------------------new feat ------------------------- */
//文档地址：https://come-future.yuque.com/sekh46/bbgc7f/vlkirb#oRCTM

/** GET Nacos配置比对 */
export const diffConfigApi= addAPIPrefix('/opsManage/k8s/multiple/diffNacosConfig');

/** POST Nacos配置同步 */
export const syncConfigApi= addAPIPrefix('/opsManage/k8s/multiple/syncNacosConfig');

/* 集群同步配置白屏化需求  */

/** GET Nacos命名空间列表 */
export const nacosNamespaceListApi= addAPIPrefix('/opsManage/multiple/common/nacosNamespace/list');

/** GET  应用部署名列表 */
export const deploymentNameListApi= addAPIPrefix('/opsManage/k8s/multiple/deploymentName/list');

/** POST   新增双集群配置 */
export const addSyncStrategyApi= addAPIPrefix('/opsManage/k8s/multiple/syncStrategy/add');

/** PUT 修改双集群配置 */
export const updateSyncStrategyApi= addAPIPrefix('/opsManage/k8s/multiple/syncStrategy/update');

/** DELETE  删除双集群配置 */
export const deleteSyncStrategyApi= addAPIPrefix('/opsManage/k8s/multiple/syncStrategy/delete');

/** GET 双集群配置列表 */
export const getSyncStrategyListApi= addAPIPrefix('/opsManage/k8s/multiple/syncStrategy/list');

/* GET 获取命名空间 */
export const getNacosNamespaceApi= addAPIPrefix('/opsManage/k8s/multiple/getNacosNamespace');

export const getClusterTopologyUrlApi= addAPIPrefix('/opsManage/k8s/multiple/getClusterTopologyUrl');

/* GET 获取DataId */
export const getNacosNsDataIdApi= addAPIPrefix('/opsManage/k8s/multiple/getNacosNsDataId');

  export const graphDashboard = (envCode: string) => {

    return getRequest(getClusterTopologyUrlApi, { data: { envCode } });
  }
  export const getCurrentDistrictInfo = (params:{infoType: string,key:string}) => {
    const url = `${appConfig.apiPrefix}/opsManage/k8s/multiple/getCurrentDistrictInfo`;
    return getRequest(url, { data: params });
  }

  export const getEnvListApi= addAPIPrefix('/monitorManage/envCode/list');