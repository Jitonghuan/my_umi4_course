/**
 * service
 * @description 用于存在接口数据或者接口调用函数
 * @create 2021-04-12 19:13:58
 */
import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';
import { getColorByValue } from '../util';

/**
 * 获取机构列表
 */
export const queryEnvListsApi = `${appConfig.apiPrefix}/monitorManage/cluster`;
export const queryEnvLists = () =>
  getRequest(queryEnvListsApi).then((res: any) => {
    if (res?.success) {
      return (
        res?.data?.map((item: any) => {
          return {
            key: item.id,
            title: item.clusterName,
          };
        }) || []
      );
    }

    return [];
  });

/**
 * 资源使用率
 */
export const queryResUseDataApi = `${appConfig.apiPrefix}/monitorManage/resource/clusterTotal`;
export const queryResUseData = (params: { clusterId: string }) =>
  getRequest(queryResUseDataApi, { data: params }).then((res: any) => {
    if (res?.success) {
      const { data = {} } = res;
      return [
        {
          title: 'CPU使用率',
          value: data?.clusterAvgCpu,
          unit: '%',
          color: getColorByValue(data?.clusterAvgCpu),
        },
        {
          title: '内存使用率',
          value: data?.clusterAvgMemory || 0,
          unit: '%',
          color: getColorByValue(data?.clusterAvgMemory),
        },
        {
          title: '磁盘使用率',
          value: data?.clusterAvgDisk || 0,
          color: getColorByValue(data?.clusterAvgDisk),
          unit: '%',
          ...(data?.clusterAvgDisk && Number(data?.clusterAvgDisk) > 90 ? { warn: '容量不足' } : {}),
        },
        {
          mode: '2',
          dataSource: [
            { title: '节点数', value: data?.clusterNodeNum },
            { title: 'POD数', value: data?.clusterPodNum },
            { title: 'Deployment数', value: data?.clusterDeploymentNum },
            { title: '告警数', value: data?.clusterAlertsNum },
          ],
        },
      ];
    }
    return [];
  });

/**
 * 节点使用率
 */
export const queryNodeUseDataApi = `${appConfig.apiPrefix}/monitorManage/resource/node`;

/**
 * 已安装大盘
 */
export const queryUseMarketDataApi = `${appConfig.apiPrefix}/monitorManage/grafana/dashboard`;
export const queryUseMarketData = (params: { clusterId: string }) =>
  getRequest(queryUseMarketDataApi, { data: params }).then((res: any) => {
    if (res?.success) {
      const { data = {} } = res;
      const result = [];
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          result.push({
            name: key,
            href: data[key],
          });
        }
      }
      return result;
    }
    return [];
  });

/**
 * 集群查询
 */
export const queryClustersUrl = `${appConfig.apiPrefix}/monitorManage/clusters`;
export const queryClustersData = (params: { envTypeCode: string }) =>
  getRequest(queryClustersUrl, { data: params }).then((resp: any) => {
    if (resp?.success) {
      let data = resp?.data;
      let clusterData: any = [];
      data.map((item: any) => {
        clusterData.push({ label: item?.clusterName, value: item?.id });
      });

      return clusterData;
    }
    return [];
  });
/**
 * POD明细列表
 */

export const queryPodUrl = `${appConfig.apiPrefix}/monitorManage/resource/pod`;
export const queryPodUseData = (clusterId: number, pageIndex?: number, pageSize?: number, keyword?: any) =>
  getRequest(queryPodUrl, { data: { clusterId, pageIndex: pageIndex || 1, pageSize: pageSize || 20, keyword } }).then(
    (res: any) => {
      if (res?.success) {
        let podResourceData: any = [];
        podResourceData = res.data;
        return podResourceData;
      }
      return [];
    },
  );
