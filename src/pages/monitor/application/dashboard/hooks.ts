/**
 * @description: 监控看板弹窗图表接口
 * @name {muxi.jth}
 * @date {2021/12/13 10:30}
 */
import { useState } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import moment from 'moment';

// POD趋势图-CPU
export function useQueryPodCpu() {
  const [queryPodCpuData, setQueryPodCpuData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryPodCpu = async (
    hostName: string,
    envCode: string,
    start: any,
    end: any,
    appCode?: string,
    ip?: string,
  ) => {
    setLoading(true);
    await getRequest(APIS.queryPodCpu, { data: { hostName, envCode, start, end, appCode, ip } })
      .then((res) => {
        if (res?.success) {
          let curxAxis: any[] = [];
          let dataSource = res?.data;
          let podCpuDataArry: any = [];
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              if (key === 'cpuLimit') {
                dataSource['cpuLimit']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);
                    podCpuDataArry.push({
                      category: 'cpuLimit_' + Object.keys(ele)[0],
                      time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
              if (key === 'cpuRequest') {
                dataSource['cpuRequest']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);
                    podCpuDataArry.push({
                      category: 'cpuRequest_' + Object.keys(ele)[0],
                      time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
              if (key === 'cpuUse') {
                dataSource['cpuUse']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);
                    podCpuDataArry.push({
                      category: 'cpuUse_' + Object.keys(ele)[0],
                      time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
            }
          }

          setQueryPodCpuData(podCpuDataArry);
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
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryPodCpuData, loading, queryPodCpu];
}

// POD趋势图-内存
export function usequeryPodMem() {
  const [queryPodMemData, setQueryPodMemData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  let curxAxis: any[] = [];
  const queryPodMem = (hostName: string, envCode: string, start: any, end: any, appCode?: string, ip?: string) => {
    setLoading(true);
    getRequest(APIS.queryPodMem, { data: { hostName, envCode, start, end, appCode, ip } })
      .then((res) => {
        if (res?.success) {
          let podMemDataArry: any = [];
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (key === 'memLimitInfo') {
              dataSource['memLimitInfo']?.map((ele: any, index_one: number) => {
                ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                  curxAxis.push(Number(item[0]) * 1000);
                  podMemDataArry.push({
                    category: 'memLimitInfo_' + Object.keys(ele)[0],
                    time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                    precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                  });
                });
              });
            }
            if (key === 'rssInfo') {
              dataSource['rssInfo']?.map((ele: any, index_one: number) => {
                ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                  curxAxis.push(Number(item[0]) * 1000);
                  podMemDataArry.push({
                    category: 'rssInfo_' + Object.keys(ele)[0],
                    time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                    precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                  });
                });
              });
            }
            if (key === 'wssInfo') {
              dataSource['wssInfo']?.map((ele: any, index_one: number) => {
                ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                  curxAxis.push(Number(item[0]) * 1000);
                  podMemDataArry.push({
                    category: 'wssInfo_' + Object.keys(ele)[0],
                    time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                    precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                  });
                });
              });
            }
          }
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

          setQueryPodMemData(podMemDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryPodMemData, loading, queryPodMem];
}

// POD趋势图-磁盘
export function useQueryPodDisk() {
  const [queryPodDiskData, setQueryPodDiskData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryPodDisk = async (
    hostName: string,
    envCode: string,
    start: any,
    end: any,
    appCode?: string,
    ip?: string,
  ) => {
    setLoading(true);
    await getRequest(APIS.queryPodDisk, { data: { hostName, envCode, start, end, appCode, ip } })
      .then((res) => {
        if (res?.success) {
          let podDiskDataArry: any = [];
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              //   const element = object[key];

              if (key === 'diskReads') {
                dataSource['diskReads']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    podDiskDataArry.push({
                      category: 'diskReads_' + Object.keys(ele)[0],
                      time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
              if (key === 'diskWrites') {
                dataSource['diskWrites']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    podDiskDataArry.push({
                      category: 'diskWrites_' + Object.keys(ele)[0],
                      time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
            }
          }

          setQueryPodDiskData(podDiskDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryPodDiskData, loading, queryPodDisk];
}

// POD趋势图-网络速率
export function useQueryPodNetwork() {
  const [queryPodNetworkData, setQueryPodNetworkData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryPodNetwork = (hostName: string, envCode: string, start: any, end: any, appCode?: string, ip?: string) => {
    setLoading(true);
    getRequest(APIS.querynetWorkBps, { data: { hostName, envCode, start, end, appCode, ip } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          let podNetworkDataArry: any = [];
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              const element = dataSource[key];
              if (key === 'receive') {
                dataSource['receive']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    podNetworkDataArry.push({
                      category: 'receive_' + Object.keys(ele)[0],
                      time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      precentage: Number(Number(item[1]).toFixed(1)),
                    });
                  });
                });
              }
              if (key === 'transmit') {
                dataSource['transmit']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    podNetworkDataArry.push({
                      category: 'transmit_' + Object.keys(ele)[0],
                      time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      precentage: Number(Number(item[1]).toFixed(1)),
                    });
                  });
                });
              }
            }
          }

          setQueryPodNetworkData(podNetworkDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryPodNetworkData, loading, queryPodNetwork];
}
