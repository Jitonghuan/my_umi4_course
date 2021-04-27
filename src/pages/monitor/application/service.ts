/**
 * service
 * @description 用于存在接口数据或者接口调用函数
 * @create 2021-04-12 19:15:42
 */
import ds from '@config/defaultSettings';
import { getRequest } from '@/utils/request';
import dayjs from 'dayjs';

const queryAppListApi = `${ds.apiPrefix}/appManage/list`;
/** 查询应用列表 */
export const queryAppList = () =>
  getRequest(queryAppListApi, {
    data: {
      pageIndex: 1,
      pageSize: 1000,
    },
  }).then((res: any) => {
    if (res.success) {
      const { dataSource = [] } = res.data || {};
      return dataSource.map((app: any) => {
        return {
          value: app.appCode,
          label: app.appCode,
        };
      });
    }
    return [];
  });

const queryEnvListApi = `${ds.apiPrefix}/monitorManage/app/env`;
/** 根据应用查询环境列表 */
export const queryEnvList = (params: { appCode: string }) =>
  getRequest(queryEnvListApi, { data: params }).then((res: any) => {
    if (res.success) {
      const { data = [] } = res;
      return data.map((env: any) => {
        return {
          value: env,
          label: env,
        };
      });
    }
    return [];
  });

/** 查询主机详情 */
export const queryPodInfoApi = `${ds.apiPrefix}/monitorManage/app/podInfo`;

// 应⽤GC次数
export const queryGcCountApi = `${ds.apiPrefix}/monitorManage/app/gcCount`;
export const queryGcCount = (params: { [key: string]: string }) =>
  getRequest(queryGcCountApi, { ...params }).then((res: any) => {
    if (res.success) {
      const {
        fullGCCount = [],
        youngGCCount = [],
        fullGCSum = [],
        youngGCSum = [],
      } = res.data;
      const xAxis: string[] = [];
      const fullCount: string[] = [];
      fullGCCount?.map((el: string[]) => {
        xAxis.push(dayjs(Number(el[0]) * 1000).format('MM-DD HH:mm'));
        fullCount.push(Number(el[1]).toFixed(2));
      });
      const youngCount =
        youngGCCount?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const fullSum =
        fullGCSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const youngSum =
        youngGCSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];

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
export const queryGcTimeApi = `${ds.apiPrefix}/monitorManage/app/gcTime`;
export const queryGcTime = (params: { [key: string]: string }) =>
  getRequest(queryGcTimeApi, { ...params }).then((res: any) => {
    if (res.success) {
      const {
        fullGCTime = [],
        youngGCTime = [],
        fullGCTimeSum = [],
        youngGCTimeSum = [],
      } = res.data;
      const xAxis: string[] = [];
      const fullTime: string[] = [];
      fullGCTime?.map((el: string[]) => {
        xAxis.push(dayjs(Number(el[0]) * 1000).format('MM-DD HH:mm'));
        fullTime.push(Number(el[1]).toFixed(2));
      });
      const youngTime =
        youngGCTime?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const fullSum =
        fullGCTimeSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const youngSum =
        youngGCTimeSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];

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
export const queryJvmHeapApi = `${ds.apiPrefix}/monitorManage/app/jvmHeap`;
export const queryJvmHeap = (params: { [key: string]: string }) =>
  getRequest(queryJvmHeapApi, { ...params }).then((res: any) => {
    if (res.success) {
      const {
        heapEdenSpace = [],
        heapMemSum = [],
        heapOldGen = [],
        heapSurvivorSpace = [],
      } = res.data;
      const xAxis: string[] = [];
      const heapEden: string[] = [];
      heapEdenSpace?.map((el: string[]) => {
        xAxis.push(dayjs(Number(el[0]) * 1000).format('MM-DD HH:mm'));
        heapEden.push(Number(el[1]).toFixed(2));
      });
      const heapSum =
        heapMemSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const heapOld =
        heapOldGen?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      const heapSurvivor =
        heapSurvivorSpace?.map((el: string[]) => Number(el[1]).toFixed(2)) ||
        [];

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
export const queryJvmMetaspaceApi = `${ds.apiPrefix}/monitorManage/app/jvmMetaSpace`;
export const queryJvmMetaspace = (params: { [key: string]: string }) =>
  getRequest(queryJvmMetaspaceApi, { ...params }).then((res: any) => {
    if (res.success) {
      const { metaspace = [] } = res.data;
      const xAxis: string[] = [];
      const fullCount: string[] = [];
      metaspace?.map((el: string[]) => {
        xAxis.push(dayjs(Number(el[0]) * 1000).format('MM-DD HH:mm'));
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
