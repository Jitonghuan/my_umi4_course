
/**
 * service
 * @description 用于存在接口数据或者接口调用函数
 * @create 2021-04-12 19:15:42
 */
import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';
import moment from 'moment';

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


      return {
        count: {
          xAxis,
          dataSource: [gcFullCountArry, gcYoungCountArry],
        },
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

    
      return {
        count: {
          xAxis,
          dataSource: [heapMemSumArry, heapEdenSpaceArry, heapSurvivorSpaceArry, heapOldGenArry],
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
      return {
        count: {
          xAxis,
          dataSource: [metaspaceArry],
        },
        sum: {},
      };
    }
    return {
      count: {},
      sum: {},
    };
  });


// 应⽤JVM堆内存使⽤
export const jvmCurrentThreadsApi = `${appConfig.apiPrefix}/monitorManage/app/jvmCurrentThreads`;
export const queryJvmCurrentThreads = (params: { [key: string]: string }) =>
  getRequest(jvmCurrentThreadsApi, { ...params }).then((res: any) => {
    if (res.success) {
      const { currentThreads = [] } = res.data;
      let curxAxis: any[] = [];
      let threadsArry: any = [];
      currentThreads?.map((ele: any, index_one: number) => {
        let dataSource: any = [];
        let dataName: any = '';
        ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
          curxAxis.push(Number(item[0]) * 1000);

          // 数据结构变一下
          dataSource.push([moment(Number(item[0]) * 1000).format('MM-DD HH:mm:ss'), Number(item[1]).toFixed(2)]);
         

          dataName = '线程数_' + Object.keys(ele)[0];
        });
        threadsArry.push({
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
      return {
        count: {
          xAxis,
          dataSource: [threadsArry],
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


