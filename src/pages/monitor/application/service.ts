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
      let xAxis: string[] = [];
      const fullCount: string[] = [];
      let gcFullCountArry: any = [];
      let gcYoungCountArry: any = [];
      let gcFullSumArry: any = [];
      let gcYoungSumArry: any = [];
      fullGCCount?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'fullGC次数_' + Object.keys(ele)[index_one];
        });
        gcFullCountArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      youngGCCount?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';

        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'youngGC次数_' + Object.keys(ele)[index_one];
        });
        gcYoungCountArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      fullGCSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'fullGCSum_' + Object.keys(ele)[index_one];
        });
        gcFullSumArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      youngGCSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'youngGCSum_' + Object.keys(ele)[index_one];
        });
        gcYoungSumArry.push({
          name: dataName,
          data: dataSource,
        });
      });

      xAxis = xAxis.filter((currentValue, index, arr) => {
        return arr.indexOf(currentValue) === index;
      });

      return {
        //瞬时值
        count: {
          xAxis,
          dataSource: gcFullCountArry.concat(gcYoungCountArry),
        },
        //累计值
        sum: {
          xAxis,
          dataSource: gcFullSumArry.concat(gcYoungSumArry),
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
      let xAxis: string[] = [];
      const fullTime: string[] = [];
      fullGCTime?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'fullGC耗时_' + Object.keys(ele)[index_one];
        });
        fullGCTimeArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      youngGCTime?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'youngGC耗时_' + Object.keys(ele)[index_one];
        });
        youngGCTimeArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      fullGCTimeSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'fullGCTimeSum_' + Object.keys(ele)[index_one];
        });
        fullGCTimeSumArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      youngGCTimeSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'youngGCTimeSum_' + Object.keys(ele)[index_one];
        });
        youngGCTimeSumArry.push({
          name: dataName,
          data: dataSource,
        });
      });

      xAxis = xAxis.filter((currentValue, index, arr) => {
        return arr.indexOf(currentValue) === index;
      });

      // const youngTime = youngGCTime?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      // const fullSum = fullGCTimeSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      // const youngSum = youngGCTimeSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];

      return {
        count: {
          xAxis,
          dataSource: fullGCTimeArry.concat(youngGCTimeArry),
        },
        sum: {
          xAxis,
          dataSource: fullGCTimeSumArry.concat(youngGCTimeSumArry),
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
      let xAxis: string[] = [];
      let heapEdenSpaceArry: any = [];
      let heapMemSumArry: any = [];
      let heapOldGenArry: any = [];
      let heapSurvivorSpaceArry: any = [];
      heapEdenSpace?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = '使用总和_' + Object.keys(ele)[index_one];
        });
        heapEdenSpaceArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      heapMemSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';

        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = '年轻代Eden区_' + Object.keys(ele)[index_one];
        });
        heapMemSumArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      heapOldGen?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = '年轻代Survivor区_' + Object.keys(ele)[index_one];
        });
        heapOldGenArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      heapSurvivorSpace?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = '老年代_' + Object.keys(ele)[index_one];
        });
        heapSurvivorSpaceArry.push({
          name: dataName,
          data: dataSource,
        });
      });

      xAxis = xAxis.filter((currentValue, index, arr) => {
        return arr.indexOf(currentValue) === index;
      });

      // const heapEden: string[] = [];
      // heapEdenSpace?.map((el: string[]) => {
      //   xAxis.push(moment(Number(el[0]) * 1000).format('MM-DD HH:mm:ss'));
      //   heapEden.push(Number(el[1]).toFixed(2));
      // });
      // const heapSum = heapMemSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      // const heapOld = heapOldGen?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      // const heapSurvivor = heapSurvivorSpace?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];

      return {
        count: {
          xAxis,
          dataSource: heapEdenSpaceArry.concat(heapMemSumArry, heapOldGenArry, heapSurvivorSpaceArry),
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
      let xAxis: string[] = [];
      let metaspaceArry: any = [];
      const fullCount: string[] = [];
      metaspace?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[index_one]]?.map((item: any, index_two: number) => {
          xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          dataSource.push(Number(item[1]).toFixed(2));
          dataName = '元空间_' + Object.keys(ele)[index_one];
        });
        metaspaceArry.push({
          name: dataName,
          data: dataSource,
        });

        // xAxis.push(moment(Number(el[0]) * 1000).format('MM-DD HH:mm:ss'));
        // fullCount.push(Number(el[1]).toFixed(2));
      });

      xAxis = xAxis.filter((currentValue, index, arr) => {
        return arr.indexOf(currentValue) === index;
      });

      return {
        count: {
          xAxis,
          dataSource: metaspaceArry,
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
