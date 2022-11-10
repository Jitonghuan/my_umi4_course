import appConfig from '@/app.config';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';
/** 查看环境 */
export const queryEnvList = `${appConfig.apiPrefix}/appManage/env/list`;


// //追踪-获取环境列表
// export const queryTraceEnvList = `${appConfig.apiPrefix}/trafficMap/tracing/envs`;
// //追踪-获取应用列表
// export const queryTraceAppListApi = `${appConfig.apiPrefix}/trafficMap/application/list`;
/** 根据应用查询环境列表 */
/** 查询应用实例 */
export const queryInstanceListApi = `${appConfig.apiPrefix}/trafficMap/application/instance/list`;
/** 查询主机详情 */
export const queryPodInfoApi = `${appConfig.apiPrefix}/monitorManage/app/podInfo`;

/** GET 应用流量列表 */
export const getTrafficList = `${appConfig.apiPrefix}/trafficMap/appTraffic/trafficList`;



/* --------------------------------详情-------------------------------------- */

/** GET 调用统计概览 */
export const getCountOverview = `${appConfig.apiPrefix}/trafficMap/callInfo/countOverview`;
///trafficMap/tracing/search
export const getSearchTracing = `${appConfig.apiPrefix}/trafficMap/tracing/search`;
/** GET 调用统计概览 */
export const getCountDetail = `${appConfig.apiPrefix}/trafficMap/callInfo/countDetail`;
//GET 节点趋势图-CPU
export const queryPodCpu = `${appConfig.apiPrefix}/monitorManage/app/cpuUseInfo`;
//GET 节点趋势图-内存
export const queryPodMem = `${appConfig.apiPrefix}/monitorManage/app/memUseInfo`;
//GET 节点趋势图-磁盘
export const queryPodDisk = `${appConfig.apiPrefix}/monitorManage/app/diskUseInfo`;
//GET 节点趋势图-网络速率
export const querynetWorkBps = `${appConfig.apiPrefix}/monitorManage/app/netWorkBps`;

