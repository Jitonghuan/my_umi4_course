import appConfig from '@/app.config';
import { delRequest, getRequest, postRequest, putRequest } from '@/utils/request';
/** 查看环境 */
export const queryEnvList = `${appConfig.apiPrefix}/appManage/env/list`;


export const queryEnvListApi = `${appConfig.apiPrefix}/monitorManage/app/env`;
/** 根据应用查询环境列表 */
/** 查询应用 */
export const queryAppListApi = `${appConfig.apiPrefix}/monitorManage/backendApp/list`;
/** 查询主机详情 */
export const queryPodInfoApi = `${appConfig.apiPrefix}/monitorManage/app/podInfo`;

/** GET 应用流量列表 */
export const getTrafficList = `${appConfig.apiPrefix}/trafficMap/appTraffic/trafficList`;
