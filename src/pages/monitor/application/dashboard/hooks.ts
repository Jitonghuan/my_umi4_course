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
          for (const key in dataSource) {
            if (Object.prototype.hasOwnProperty.call(dataSource, key)) {
              if (key === 'cpulimit') {
                dataSource['cpulimit']?.map((ele: any) => {
                  podCpuDataArry.push({
                    category: 'cpulimit',
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(Number(ele[1]).toFixed(1)),
                  });
                });
              }
              if (key === 'cpurequest') {
                dataSource['cpurequest']?.map((ele: any) => {
                  podCpuDataArry.push({
                    category: 'cpurequest',
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(Number(ele[1]).toFixed(1)),
                  });
                });
              }
              if (key === 'cpuuse') {
                dataSource['cpuuse']?.map((ele: any) => {
                  podCpuDataArry.push({
                    category: 'cpuuse',
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(Number(ele[1]).toFixed(1)),
                  });
                });
              }
            }
          }

          setQueryPodCpuData(podCpuDataArry);
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
          let dataSource = res?.data;
          for (const key in dataSource) {
            if (key === 'menlimitinfo') {
              dataSource['menlimitinfo']?.map((item: any) => {
                podMemDataArry.push({
                  time: moment(parseInt(item[0]) * 1000).format('HH:mm'),
                  precentage: Number(Number(item[1]).toFixed(1)),
                  category: key,
                });
              });
            }
            if (key === 'rssinfo') {
              dataSource['rssinfo']?.map((item: any) => {
                podMemDataArry.push({
                  time: moment(parseInt(item[0]) * 1000).format('HH:mm'),
                  precentage: Number(Number(item[1]).toFixed(1)),
                  category: key,
                });
              });
            }
            if (key === 'wssinfo') {
              dataSource['wssinfo']?.map((item: any) => {
                podMemDataArry.push({
                  time: moment(parseInt(item[0]) * 1000).format('HH:mm'),
                  precentage: Number(Number(item[1]).toFixed(1)),
                  category: key,
                });
              });
            }
          }
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

              if (key === 'diskreads') {
                dataSource['diskreads']?.map((ele: any) => {
                  podDiskDataArry.push({
                    value: Number(Number(ele[1]).toFixed(1)),
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    category: key,
                  });
                });
              }
              if (key === 'diskwrites') {
                dataSource['diskwrites']?.map((ele: any) => {
                  podDiskDataArry.push({
                    value: Number(Number(ele[1]).toFixed(1)),
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    category: key,
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
                dataSource['receive']?.map((ele: any) => {
                  podNetworkDataArry.push({
                    category: key,
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(Number(ele[1]).toFixed(1)),
                  });
                });
              }
              if (key === 'transmit') {
                dataSource['transmit']?.map((ele: any) => {
                  podNetworkDataArry.push({
                    category: key,
                    time: moment(parseInt(ele[0]) * 1000).format('HH:mm'),
                    precentage: Number(Number(ele[1]).toFixed(1)),
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
