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
      let envObj: any = {};
      return (
        dataSource?.map((env: any) => {
          if (env.envName.search('前端') === -1) {
            envObj = {
              ...env,
              value: env.envCode,
              label: env.envCode,
            };
          }

          return envObj;
          // return {
          //   ...env,
          //   value: env.envCode,
          //   label: env.envCode,
          // };
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
      let curxAxis: any[] = [];
      let gcFullSumArry: any = [];
      let gcYoungSumArry: any = [];
      let ipallDataFull: any = [];
      let ipallDataYoung: any = [];

      fullGCCount?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          ipallDataFull.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
      });

      ipallDataFull.sort((a: any, b: any) => {
        return a.timeData - b.timeData;
      });
      youngGCCount?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          let dataall = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          ipallDataYoung.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
      });
      ipallDataYoung.sort((a: any, b: any) => {
        return a.timeData - b.timeData;
      });
      fullGCSum?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          gcFullSumArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
      });
      gcFullSumArry.sort((a: any, b: any) => {
        return a.timeData - b.timeData;
      });

      youngGCSum?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          gcYoungSumArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
      });
      gcYoungSumArry.sort((a: any, b: any) => {
        return a.timeData - b.timeData;
      });

      curxAxis = curxAxis.filter((currentValue, index, arr) => {
        return arr.indexOf(currentValue) === index;
      });
      curxAxis.sort((a: any, b: any) => {
        return a - b;
      });
      let xAxis: any = [];
      curxAxis?.map((item) => {
        xAxis.push(moment(Number(item)).format('MM-DD HH:mm:ss'));
      });
      return {
        //瞬时值
        count: {
          xAxis,
          dataSource: [ipallDataFull, ipallDataYoung],
        },
        //累计值
        sum: {
          xAxis,
          dataSource: [gcFullSumArry, gcYoungSumArry],
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
      let fullGCTimeArry: any = [];
      let youngGCTimeArry: any = [];
      let fullGCTimeSumArry: any = [];
      let youngGCTimeSumArry: any = [];
      let curxAxis: any[] = [];
      const fullTime: string[] = [];
      fullGCTime?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          fullGCTimeArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
      });
      fullGCTimeArry.sort((a: any, b: any) => {
        return a.timeData - b.timeData;
      });

      youngGCTime?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          youngGCTimeArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
        youngGCTimeArry.sort((a: any, b: any) => {
          return a.timeData - b.timeData;
        });
      });
      fullGCTimeSum?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          fullGCTimeSumArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
        fullGCTimeSumArry.sort((a: any, b: any) => {
          return a.timeData - b.timeData;
        });
      });
      youngGCTimeSum?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          youngGCTimeSumArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
        youngGCTimeSumArry.sort((a: any, b: any) => {
          return a.timeData - b.timeData;
        });
      });

      curxAxis = curxAxis.filter((currentValue, index, arr) => {
        return arr.indexOf(currentValue) === index;
      });
      curxAxis.sort((a: any, b: any) => {
        return a - b;
      });
      let xAxis: any = [];
      curxAxis?.map((item) => {
        xAxis.push(moment(Number(item)).format('MM-DD HH:mm:ss'));
      });
      return {
        count: {
          xAxis,
          dataSource: [fullGCTimeArry, youngGCTimeArry],
        },
        sum: {
          xAxis,
          dataSource: [fullGCTimeSumArry, youngGCTimeSumArry],
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
      let curxAxis: any[] = [];
      let heapEdenSpaceArry: any = [];
      let heapMemSumArry: any = [];
      let heapOldGenArry: any = [];
      let heapSurvivorSpaceArry: any = [];
      heapEdenSpace?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          heapEdenSpaceArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
        heapEdenSpaceArry.sort((a: any, b: any) => {
          return a.timeData - b.timeData;
        });
      });
      heapMemSum?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          heapMemSumArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
        heapMemSumArry.sort((a: any, b: any) => {
          return a.timeData - b.timeData;
        });
      });
      heapOldGen?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          heapOldGenArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
        heapOldGenArry.sort((a: any, b: any) => {
          return a.timeData - b.timeData;
        });
      });
      heapSurvivorSpace?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          heapSurvivorSpaceArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
        heapSurvivorSpaceArry.sort((a: any, b: any) => {
          return a.timeData - b.timeData;
        });
      });

      curxAxis = curxAxis.filter((currentValue, index, arr) => {
        return arr.indexOf(currentValue) === index;
      });
      curxAxis.sort((a: any, b: any) => {
        return a - b;
      });
      let xAxis: any = [];
      curxAxis?.map((item) => {
        xAxis.push(moment(Number(item)).format('MM-DD HH:mm:ss'));
      });

      return {
        count: {
          xAxis,
          dataSource: [heapEdenSpaceArry, heapMemSumArry, heapOldGenArry, heapSurvivorSpaceArry],
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
      let curxAxis: any[] = [];
      let metaspaceArry: any = [];
      const fullCount: string[] = [];
      metaspace?.map((ele: any, index_one: number) => {
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          let dataall: any = {
            value: Number(item[1]).toFixed(2),
            ip: Object.keys(ele)[0],
            timeData: Number(item[0]) * 1000,
          };
          metaspaceArry.push(dataall);
          curxAxis.push(Number(item[0]) * 1000);
        });
        metaspaceArry.sort((a: any, b: any) => {
          return a.timeData - b.timeData;
        });
      });

      curxAxis = curxAxis.filter((currentValue, index, arr) => {
        return arr.indexOf(currentValue) === index;
      });
      curxAxis.sort((a: any, b: any) => {
        return a - b;
      });
      let xAxis: any = [];
      curxAxis?.map((item) => {
        xAxis.push(moment(Number(item)).format('MM-DD HH:mm:ss'));
      });
      let arry = [0, 9, 0];
      return {
        count: {
          xAxis,
          dataSource: metaspaceArry,
          newArry: arry,
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
