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
          let dataSource = res?.data;
          let podCpuDataArry: any = [];
          let podCpuDataSource: any = [];

          let cpuLimitData: any = [];
          let cpuRequestData: any = [];
          let cpuUseData: any = [];

          let cpuLimitDataSource: any = [];
          let cpuRequestDataSource: any = [];
          let cpuUseDataSource: any = [];

          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              if (key === 'cpuLimit') {
                dataSource['cpuLimit']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    cpuLimitData.push({
                      category: 'cpuLimit_' + Object.keys(ele)[0],
                      // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      time: parseInt(item[0]) * 1000,
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
              if (key === 'cpuRequest') {
                dataSource['cpuRequest']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    cpuRequestData.push({
                      category: 'cpuRequest_' + Object.keys(ele)[0],
                      // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      time: parseInt(item[0]) * 1000,
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
              if (key === 'cpuUse') {
                dataSource['cpuUse']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    cpuUseData.push({
                      category: 'cpuUse_' + Object.keys(ele)[0],
                      // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      time: parseInt(item[0]) * 1000,
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
            }
          }

          /* ---------------- */
          cpuLimitData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          cpuLimitData.map((el: any) => {
            cpuLimitDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          /* ---------------- */
          cpuRequestData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          cpuRequestData.map((el: any) => {
            cpuRequestDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          /* ---------------- */
          cpuUseData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          cpuUseData.map((el: any) => {
            cpuUseDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          const sumData = [cpuUseDataSource, cpuRequestDataSource, cpuLimitDataSource];

          setQueryPodCpuData(sumData);
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

  const queryPodMem = (hostName: string, envCode: string, start: any, end: any, appCode?: string, ip?: string) => {
    setLoading(true);
    getRequest(APIS.queryPodMem, { data: { hostName, envCode, start, end, appCode, ip } })
      .then((res) => {
        if (res?.success) {
          let podMemDataArry: any = [];
          let podMemDataSource: any = [];
          let dataSource = res?.data;

          /* -------------- */
          let memLimitInfoData: any = [];
          let rssInfoData: any = [];
          let wssInfoData: any = [];

          /* -------------- */
          let memLimitInfoDataSource: any = [];
          let rssInfoDataSource: any = [];
          let wssInfoDataSource: any = [];

          for (const key in dataSource) {
            if (key === 'memLimitInfo') {
              dataSource['memLimitInfo']?.map((ele: any, index_one: number) => {
                ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                  memLimitInfoData.push({
                    category: 'memLimitInfo_' + Object.keys(ele)[0],
                    // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                    time: parseInt(item[0]) * 1000,
                    precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                  });
                });
              });
            }
            if (key === 'rssInfo') {
              dataSource['rssInfo']?.map((ele: any, index_one: number) => {
                ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                  rssInfoData.push({
                    category: 'rssInfo_' + Object.keys(ele)[0],
                    // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                    time: parseInt(item[0]) * 1000,
                    precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                  });
                });
              });
            }
            if (key === 'wssInfo') {
              dataSource['wssInfo']?.map((ele: any, index_one: number) => {
                ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                  wssInfoData.push({
                    category: 'wssInfo_' + Object.keys(ele)[0],
                    // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                    time: parseInt(item[0]) * 1000,
                    precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                  });
                });
              });
            }
          }

          // podMemDataArry.sort((a: any, b: any) => {
          //   return a.time - b.time;
          // });

          // podMemDataArry.map((el: any) => {
          //   podMemDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          // });

          /* ---------------- */
          memLimitInfoData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          memLimitInfoData.map((el: any) => {
            memLimitInfoDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          /* ---------------- */
          rssInfoData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          rssInfoData.map((el: any) => {
            rssInfoDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          /* ---------------- */
          wssInfoData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          wssInfoData.map((el: any) => {
            wssInfoDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          const sumData = [rssInfoDataSource, wssInfoDataSource, memLimitInfoDataSource];

          setQueryPodMemData(sumData);
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
          let podDiskDataSource: any = [];

          let diskReadsData: any = [];
          let diskWritesData: any = [];

          let diskReadsDataSource: any = [];
          let diskWritesDataSource: any = [];

          let dataSource = res?.data;
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              //   const element = object[key];

              if (key === 'diskReads') {
                dataSource['diskReads']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    diskReadsData.push({
                      category: 'diskReads_' + Object.keys(ele)[0],
                      // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      time: parseInt(item[0]) * 1000,
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
              if (key === 'diskWrites') {
                dataSource['diskWrites']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    diskWritesData.push({
                      category: 'diskWrites_' + Object.keys(ele)[0],
                      // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      time: parseInt(item[0]) * 1000,
                      precentage: item[1] ? Number(Number(item[1]).toFixed(1)) : 0,
                    });
                  });
                });
              }
            }
          }
          // podDiskDataArry.sort((a: any, b: any) => {
          //   return a.time - b.time;
          // });

          // podDiskDataArry.map((el: any) => {
          //   podDiskDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          // });

          /* ---------------- */
          diskReadsData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          diskReadsData.map((el: any) => {
            diskReadsDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          /* ---------------- */
          diskWritesData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          diskWritesData.map((el: any) => {
            diskWritesDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          const sumData = [diskReadsDataSource, diskWritesDataSource];

          setQueryPodDiskData(sumData);
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
          let podNetWorkDataSource: any = [];

          let receiveData: any = [];
          let transmitData: any = [];

          let receiveDataSource: any = [];
          let transmitDataSource: any = [];

          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              const element = dataSource[key];
              if (key === 'receive') {
                dataSource['receive']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    receiveData.push({
                      category: 'receive_' + Object.keys(ele)[0],
                      // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      time: parseInt(item[0]) * 1000,
                      precentage: Number(Number(item[1]).toFixed(1)),
                    });
                  });
                });
              }
              if (key === 'transmit') {
                dataSource['transmit']?.map((ele: any, index_one: number) => {
                  ele[Object.keys(ele)[0]]?.map((item: any, index_two: number) => {
                    transmitData.push({
                      category: 'transmit_' + Object.keys(ele)[0],
                      // time: moment(parseInt(item[0]) * 1000).format('MM-DD HH:mm'),
                      time: parseInt(item[0]) * 1000,
                      precentage: Number(Number(item[1]).toFixed(1)),
                    });
                  });
                });
              }
            }
          }
          // podNetworkDataArry.sort((a: any, b: any) => {
          //   return a.time - b.time;
          // });

          // podNetworkDataArry.map((el: any) => {
          //   podNetWorkDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          // });

          /* ---------------- */
          receiveData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          receiveData.map((el: any) => {
            receiveDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          /* ---------------- */
          transmitData.sort((a: any, b: any) => {
            return a.time - b.time;
          });

          transmitData.map((el: any) => {
            transmitDataSource.push({ ...el, time: moment(el?.time).format('MM-DD HH:mm:ss') });
          });

          const sumData = [receiveDataSource, transmitDataSource];

          setQueryPodNetworkData(sumData);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryPodNetworkData, loading, queryPodNetwork];
}
