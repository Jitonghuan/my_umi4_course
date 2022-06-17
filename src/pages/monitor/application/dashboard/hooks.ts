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

  let curxAxis: any[] = [];
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
          let dataSource = res?.data;
          let podCpuDataArry: any = [];
          let podCpuRequest: any = [];
          let podCpuUse: any = [];
          let cpuLimitAll: any = [];
          let montArray: any = [];
          let podMonet: any = [];
          let useMonet: any = [];
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              if (key === 'cpuLimit') {
                dataSource['cpuLimit']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);

                    let cpudataObj = {
                      time: parseInt(item[0]) * 1000,
                      name: Object.keys(ele)[0],
                      value: Number(Number(item[1]).toFixed(2)),
                      category: 'cpuLimit',
                    };
                    podCpuDataArry.push(cpudataObj);
                  });
                });

                podCpuDataArry.sort((a: any, b: any) => {
                  return a.time - b.time;
                });

                podCpuDataArry.map((el: any) => {
                  montArray.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss'), test: '11111' });
                });
              }
              if (key === 'cpuRequest') {
                dataSource['cpuRequest']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);
                    let cpudataObj = {
                      time: parseInt(item[0]) * 1000,
                      name: Object.keys(ele)[0],
                      value: Number(Number(item[1]).toFixed(2)),
                      category: 'cpuRequest',
                    };
                    podCpuRequest.push(cpudataObj);
                  });
                });
                podCpuRequest.sort((a: any, b: any) => {
                  return a.time - b.time;
                });

                podCpuRequest.map((el: any) => {
                  podMonet.push({
                    ...el,
                    time: moment(el?.time).format('MM-DD HH:mm:ss'),
                  });
                });
              }
              if (key === 'cpuUse') {
                dataSource['cpuUse']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);
                    podCpuUse.push({
                      time: parseInt(item[0]) * 1000,
                      name: Object.keys(ele)[0],
                      value: Number(item[1]).toFixed(2),
                      category: 'cpuUse',
                    });
                  });
                });
                podCpuUse.sort((a: any, b: any) => {
                  return a.time - b.time;
                });

                podCpuUse.map((el: any) => {
                  useMonet.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
                  // return
                });
                // cpuLimitAll.push(useMonet);
              }
            }
          }
          cpuLimitAll = [montArray, podMonet, useMonet];
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
          setQueryPodCpuData(cpuLimitAll);
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
          let rssInfoDataArry: any = [];
          let wssInfoDataArry: any = [];
          let podMemAll: any = [];
          let montArray: any = [];
          let memLimitMoment: any = [];
          let rssMoment: any = [];
          let wssMoment: any = [];
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (key === 'memLimitInfo') {
              dataSource['memLimitInfo']?.map((ele: any, index_one: number) => {
                ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                  curxAxis.push(Number(item[0]) * 1000);

                  let cpudataObj = {
                    time: parseInt(item[0]) * 1000,
                    name: Object.keys(ele)[0],
                    value: Number(Number(item[1]).toFixed(1)),
                    category: 'memLimitInfo',
                  };
                  podMemDataArry.push(cpudataObj);
                });
              });
              podMemDataArry.sort((a: any, b: any) => {
                return a.time - b.time;
              });

              podMemDataArry.map((el: any) => {
                montArray.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
              });
            }
            //rssInfoDataArry
            if (key === 'rssInfo') {
              dataSource['rssInfo']?.map((ele: any, index_one: number) => {
                ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                  curxAxis.push(Number(item[0]) * 1000);

                  let cpudataObj = {
                    time: parseInt(item[0]) * 1000,
                    name: Object.keys(ele)[0],
                    value: Number(Number(item[1]).toFixed(1)),
                    category: 'rssInfo',
                  };
                  rssInfoDataArry.push(cpudataObj);
                });
              });
              rssInfoDataArry.sort((a: any, b: any) => {
                return a.time - b.time;
              });

              rssInfoDataArry.map((el: any) => {
                rssMoment.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
              });
            }
            //wssInfoDataArry
            if (key === 'wssInfo') {
              dataSource['wssInfo']?.map((ele: any, index_one: number) => {
                ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                  curxAxis.push(Number(item[0]) * 1000);

                  let cpudataObj = {
                    time: parseInt(item[0]) * 1000,
                    name: Object.keys(ele)[0],
                    value: Number(Number(item[1]).toFixed(1)),
                    category: 'wssInfo',
                  };
                  wssInfoDataArry.push(cpudataObj);
                });
              });
              wssInfoDataArry.sort((a: any, b: any) => {
                return a.time - b.time;
              });

              wssInfoDataArry.map((el: any) => {
                wssMoment.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
              });
            }
          }
          podMemAll = [montArray, rssMoment, wssMoment];
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
          setQueryPodMemData(podMemAll);
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
  let curxAxis: any[] = [];
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
          let diskReadsDataArry: any = [];
          let diskWritesDataArry: any = [];
          let diskReadsMoment: any = [];
          let diskWritesMoment: any = [];
          let diskAll: any = [];
          let podDiskDataArry: any = [];
          let montArray: any = [];
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              //   const element = object[key];

              if (key === 'diskReads') {
                dataSource['diskReads']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);

                    let cpudataObj = {
                      time: parseInt(item[0]) * 1000,
                      name: Object.keys(ele)[0],
                      value: Number(Number(item[1]).toFixed(1)),
                      category: 'diskReads',
                    };
                    podDiskDataArry.push(cpudataObj);
                  });
                });
                podDiskDataArry.sort((a: any, b: any) => {
                  return a.time - b.time;
                });

                podDiskDataArry.map((el: any) => {
                  montArray.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
                });
              }
              if (key === 'diskWrites') {
                dataSource['diskWrites']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);

                    let cpudataObj = {
                      time: parseInt(item[0]) * 1000,
                      name: Object.keys(ele)[0],
                      value: Number(Number(item[1]).toFixed(1)),
                      category: 'diskWrites',
                    };
                    diskWritesDataArry.push(cpudataObj);
                  });
                });
                diskWritesDataArry.sort((a: any, b: any) => {
                  return a.time - b.time;
                });

                diskWritesDataArry.map((el: any) => {
                  diskWritesMoment.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
                });
              }
            }
          }
          diskAll = [montArray, diskWritesMoment];
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
          setQueryPodDiskData(diskAll);
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
  let curxAxis: any[] = [];
  const queryPodNetwork = (hostName: string, envCode: string, start: any, end: any, appCode?: string, ip?: string) => {
    setLoading(true);
    getRequest(APIS.querynetWorkBps, { data: { hostName, envCode, start, end, appCode, ip } })
      .then((res) => {
        if (res?.success) {
          let receiveDataArry: any = [];
          let transmitDataArry: any = [];
          let transmitsMoment: any = [];
          let receiveMoment: any = [];
          let networkAll: any = [];
          let montArray: any = [];
          let dataSource = res?.data;
          let podNetworkDataArry: any = [];
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              const element = dataSource[key];
              if (key === 'receive') {
                dataSource['receive']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);

                    let cpudataObj = {
                      time: parseInt(item[0]) * 1000,
                      name: Object.keys(ele)[0],
                      value: Number(Number(item[1]).toFixed(1)),
                      category: 'receive',
                    };
                    receiveDataArry.push(cpudataObj);
                  });
                });
                receiveDataArry.sort((a: any, b: any) => {
                  return a.time - b.time;
                });

                receiveDataArry.map((el: any) => {
                  receiveMoment.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
                });
              }
              if (key === 'transmit') {
                dataSource['transmit']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    curxAxis.push(Number(item[0]) * 1000);

                    let cpudataObj = {
                      time: parseInt(item[0]) * 1000,
                      name: Object.keys(ele)[0],
                      value: Number(Number(item[1]).toFixed(1)),
                      category: 'transmit',
                    };
                    transmitDataArry.push(cpudataObj);
                  });
                });
                transmitDataArry.sort((a: any, b: any) => {
                  return a.time - b.time;
                });

                transmitDataArry.map((el: any) => {
                  transmitsMoment.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
                });
              }
            }
          }
          networkAll = [receiveMoment, transmitsMoment];
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
          setQueryPodNetworkData(networkAll);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryPodNetworkData, loading, queryPodNetwork];
}
