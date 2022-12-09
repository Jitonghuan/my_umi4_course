import appConfig from "@/app.config";
import { getRequest } from "@/utils/request";

/**
 * GET 根据数据源类型获取数据源和模板
 * @param clusterCode
 * @param graphUuid
 * @returns
 */
export const graphDashboard = (clusterId: string) => {
  const url = `${appConfig.apiPrefix}/monitorManage/centralDashboard`;
  return getRequest(url, { data: { clusterId } });
}
export const getCurrentDistrictInfo = (params:{infoType: string,key:string}) => {
  const url = `${appConfig.apiPrefix}/multiple/common/getCurrentDistrictInfo`;
  return getRequest(url, { data: params });
}
