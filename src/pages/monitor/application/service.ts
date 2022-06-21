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
      const fullCount: string[] = [];
      let gcFullCountArry: any = [];
      let gcYoungCountArry: any = [];
      let gcFullSumArry: any = [];
      let gcYoungSumArry: any = [];
      fullGCCount?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          // xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'fullGC次数_' + Object.keys(ele)[0];
        });
        gcFullCountArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      youngGCCount?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';

        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          // xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'youngGC次数_' + Object.keys(ele)[0];
        });
        gcYoungCountArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      fullGCSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          // xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'fullGCSum_' + Object.keys(ele)[0];
        });
        gcFullSumArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      youngGCSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          // xAxis.push(moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'));
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'youngGCSum_' + Object.keys(ele)[0];
        });
        gcYoungSumArry.push({
          name: dataName,
          data: dataSource,
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
      console.log('gcFullSumArry,gcYoungCountArry,gcYoungSumArry', gcFullSumArry, gcYoungCountArry, gcYoungSumArry);

      return {
        //瞬时值
        fullCount: {
          xAxis,
          dataSource: gcFullCountArry,
        },
        //累计值
        fullSum: {
          xAxis,
          dataSource: gcFullSumArry,
        },
        //瞬时值
        youngCount: {
          xAxis,
          dataSource: gcYoungCountArry,
        },
        //累计值
        youngSum: {
          xAxis,
          dataSource: gcYoungSumArry,
        },
      };
    }
    return {
      fullCount: {},
      fullSum: {},
      youngCount: {},
      youngSum: {},
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
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'fullGC耗时_' + Object.keys(ele)[0];
        });
        fullGCTimeArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      youngGCTime?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'youngGC耗时_' + Object.keys(ele)[0];
        });
        youngGCTimeArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      fullGCTimeSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          // dataSource.push(Number(item[1]).toFixed(2));
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          dataName = 'fullGCTimeSum_' + Object.keys(ele)[0];
        });
        fullGCTimeSumArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      youngGCTimeSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = 'youngGCTimeSum_' + Object.keys(ele)[0];
        });
        youngGCTimeSumArry.push({
          name: dataName,
          data: dataSource,
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

      // const youngTime = youngGCTime?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      // const fullSum = fullGCTimeSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      // const youngSum = youngGCTimeSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];

      return {
        fullCount: {
          xAxis,
          dataSource: fullGCTimeArry,
        },
        fullSum: {
          xAxis,
          dataSource: fullGCTimeSumArry,
        },
        youngCount: {
          xAxis,
          dataSource: youngGCTimeArry,
        },
        youngSum: {
          xAxis,
          dataSource: youngGCTimeSumArry,
        },
      };
    }
    return {
      fullCount: {},
      fullSum: {},
      youngCount: {},
      youngSum: {},
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
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = '使用总和_' + Object.keys(ele)[0];
        });
        heapEdenSpaceArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      heapMemSum?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';

        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = '年轻代Eden区_' + Object.keys(ele)[0];
        });
        heapMemSumArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      heapOldGen?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = '年轻代Survivor区_' + Object.keys(ele)[0];
        });
        heapOldGenArry.push({
          name: dataName,
          data: dataSource,
        });
      });
      heapSurvivorSpace?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);
          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));
          dataName = '老年代_' + Object.keys(ele)[0];
        });
        heapSurvivorSpaceArry.push({
          name: dataName,
          data: dataSource,
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

      // const heapEden: string[] = [];
      // heapEdenSpace?.map((el: string[]) => {
      //   xAxis.push(moment(Number(el[0]) * 1000).format('MM-DD HH:mm:ss'));
      //   heapEden.push(Number(el[1]).toFixed(2));
      // });
      // const heapSum = heapMemSum?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      // const heapOld = heapOldGen?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];
      // const heapSurvivor = heapSurvivorSpace?.map((el: string[]) => Number(el[1]).toFixed(2)) || [];

      return {
        //使用总和
        fullCount: {
          xAxis,
          dataSource: heapMemSumArry,
        },
        //年轻代Eden区
        fullSum: {
          xAxis,
          dataSource: heapEdenSpaceArry,
        },
        // 年轻代Survivor区
        youngCount: {
          xAxis,
          dataSource: heapSurvivorSpaceArry,
        },
        //老年代
        youngSum: {
          xAxis,
          dataSource: heapOldGenArry,
        },
        sum: {},
      };
    }
    return {
      fullCount: {},
      fullSum: {},
      youngCount: {},
      youngSum: {},
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
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);

          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
          // dataSource.push(Number(item[1]).toFixed(2));

          dataName = '元空间_' + Object.keys(ele)[0];
        });
        metaspaceArry.push({
          name: dataName,
          data: dataSource,
        });

        // xAxis.push(moment(Number(el[0]) * 1000).format('MM-DD HH:mm:ss'));
        // fullCount.push(Number(el[1]).toFixed(2));
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
      console.log('metaspaceArry', metaspaceArry);

      return {
        fullCount: {
          xAxis,
          dataSource: metaspaceArry,
        },
        sum: {},
      };
    }
    return {
      fullCount: {},
      fullSum: {},
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
