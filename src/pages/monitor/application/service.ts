/**
 * service
 * @description 用于存在接口数据或者接口调用函数
 * @create 2021-04-12 19:15:42
 */
import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';
import moment from 'moment';

const queryAppListApi = `${appConfig.apiPrefix}/monitorManage/backendApp/list`;
/** 查询应用列表 */
export const queryAppList = () =>
  getRequest(queryAppListApi, {
    data: {
      pageIndex: 1,
      pageSize: 1000,
    },
  }).then((res: any) => {
    if (res?.success) {
      const { dataSource = [] } = res?.data || {};
      return dataSource.map((app: any) => {
        return {
          ...app,
          value: app.appCode,
          label: app.appCode,
        };
      });
    }
    return [];
  });

const queryEnvListApi = `${appConfig.apiPrefix}/monitorManage/app/env`;
/** 根据应用查询环境列表 */
export const queryEnvList = (params: { appCode: string }) =>
  getRequest(queryEnvListApi, { data: params }).then((res: any) => {
    if (res?.success) {
      const { dataSource = [] } = res?.data;
      return (
        dataSource?.map((env: any) => {
          return {
            ...env,
            value: env.envCode,
            label: env.envCode,
          };
        }) || []
      );
    }
    return [];
  });

/** 查询主机详情 */
export const queryPodInfoApi = `${appConfig.apiPrefix}/monitorManage/app/podInfo`;

// 应⽤GC次数
export const queryGcCountApi = `${appConfig.apiPrefix}/monitorManage/app/gcCount`;
export const queryGcCount = (params: { [key: string]: string }) =>
  getRequest(queryGcCountApi, { ...params }).then((res: any) => {
    if (res?.success) {
      const { fullGCCount = [], youngGCCount = [], fullGCSum = [], youngGCSum = [] } = res.data;
      const xAxis: string[] = [];
      const fullCount: string[] = [];
      fullGCCount?.map((el: string[]) => {
        xAxis.push(moment(Number(el[0]) * 1000).format('MM-DD HH:mm:ss'));
        fullCount.push(Number(el[1]).toFixed(2));
      });
      const youngCount = youngGCCount?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const fullSum = fullGCSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const youngSum = youngGCSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];

      return {
        count: {
          xAxis,
          dataSource: [fullCount, youngCount],
        },
        sum: {
          xAxis,
          dataSource: [fullSum, youngSum],
        },
      };
    }
    return {
      count: {},
      sum: {},
    };
  });

// 应⽤GC耗时
export const queryGcTimeApi = `${appConfig.apiPrefix}/monitorManage/app/gcTime`;
export const queryGcTime = (params: { [key: string]: string }) =>
  getRequest(queryGcTimeApi, { ...params }).then((res: any) => {
    if (res?.success) {
      const { fullGCTime = [], youngGCTime = [], fullGCTimeSum = [], youngGCTimeSum = [] } = res.data;
      const xAxis: string[] = [];
      const fullTime: string[] = [];
      fullGCTime?.map((el: string[]) => {
        xAxis.push(moment(Number(el[0]) * 1000).format('MM-DD HH:mm:ss'));
        fullTime.push(Number(el[1]).toFixed(2));
      });
      const youngTime = youngGCTime?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const fullSum = fullGCTimeSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const youngSum = youngGCTimeSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];

      return {
        count: {
          xAxis,
          dataSource: [fullTime, youngTime],
        },
        sum: {
          xAxis,
          dataSource: [fullSum, youngSum],
        },
      };
    }
    return {
      count: {},
      sum: {},
    };
  });

// 应⽤JVM堆内存使⽤
export const queryJvmHeapApi = `${appConfig.apiPrefix}/monitorManage/app/jvmHeap`;
export const queryJvmHeap = (params: { [key: string]: string }) =>
  getRequest(queryJvmHeapApi, { ...params }).then((res: any) => {
    if (res?.success) {
      const { heapEdenSpace = [], heapMemSum = [], heapOldGen = [], heapSurvivorSpace = [] } = res.data;
      const xAxis: string[] = [];
      const heapEden: string[] = [];
      heapEdenSpace?.map((el: string[]) => {
        xAxis.push(moment(Number(el[0]) * 1000).format('MM-DD HH:mm:ss'));
        heapEden.push(Number(el[1]).toFixed(2));
      });
      const heapSum = heapMemSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const heapOld = heapOldGen?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const heapSurvivor = heapSurvivorSpace?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];

      return {
        count: {
          xAxis,
          dataSource: [heapSum, heapEden, heapSurvivor, heapOld],
        },
        sum: {},
      };
    }
    return {
      count: {},
      sum: {},
    };
  });

// 应⽤JVM元空间使⽤
export const queryJvmMetaspaceApi = `${appConfig.apiPrefix}/monitorManage/app/jvmMetaSpace`;
export const queryJvmMetaspace = (params: { [key: string]: string }) =>
  getRequest(queryJvmMetaspaceApi, { ...params }).then((res: any) => {
    if (res.success) {
      const { metaspace = [] } = res.data;
      const xAxis: string[] = [];
      const fullCount: string[] = [];
      metaspace?.map((el: string[]) => {
        xAxis.push(moment(Number(el[0]) * 1000).format('MM-DD HH:mm:ss'));
        fullCount.push(Number(el[1]).toFixed(2));
      });

      return {
        count: {
          xAxis,
          dataSource: [fullCount],
        },
        sum: {},
      };
    }
    return {
      count: {},
      sum: {},
    };
  });

/**
 * POD明细列表
 */
export const queryPodUrl = `${appConfig.apiPrefix}/monitorManage/app/CpuUseInfo`;
export const queryPodUseData = (params: {
  clusterId?: string;
  pageIdex?: number;
  pageSize?: number;
  envCode?: string;
  keyword?: string;
  nameSpace?: string;
}) =>
  getRequest(queryPodUrl, { data: params }).then((res: any) => {
    if (res?.success) {
      let podResourceData: any = [];
      podResourceData = res.dataSource;

      return podResourceData;
    }
    return [];
  });
