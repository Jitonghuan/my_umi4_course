/**
 * service
 * @description 用于存在接口数据或者接口调用函数
 * @create 2021-04-12 19:15:42
 */
import ds from '@config/defaultSettings';
import { getRequest } from '@/utils/request';

const queryAppListApi = `${ds.apiPrefix}/monitorManage/app/list`;
/** 查询应用列表 */
export const queryAppList = () =>
  getRequest(queryAppListApi).then((res: any) => {
    if (res.success) {
      const { data = [] } = res;
      return data.map((app: any) => {
        return {
          value: app.appCode,
          label: app.appName,
        };
      });
    }
    return [];
  });

const queryEnvListApi = `${ds.apiPrefix}/monitorManage/env/list`;
/** 根据应用查询环境列表 */
export const queryEnvList = (params: { appCode: string }) =>
  getRequest(queryEnvListApi, { data: params }).then((res: any) => {
    if (res.success) {
      const { data = [] } = res;
      return data.map((env: any) => {
        return {
          value: env.envCode,
          label: env.envName,
        };
      });
    }
    return [];
  });

/** 查询主机详情 */
export const queryPodInfoApi = `${ds.apiPrefix}/monitorManage/app/podInfo`;

// 应⽤GC次数
export const queryGcCountApi = `${ds.apiPrefix}/monitorManage/app/gcCount`;

// 应⽤GC耗时
export const queryGcTimeApi = `${ds.apiPrefix}/monitorManage/app/gcTime`;

// 应⽤JVM堆内存使⽤
export const queryJvmHeapApi = `${ds.apiPrefix}/monitorManage/app/jvmHeap`;

// 应⽤JVM元空间使⽤
export const queryJvmMetaspaceApi = `${ds.apiPrefix}/monitorManage/app/jvmMetaspace`;
