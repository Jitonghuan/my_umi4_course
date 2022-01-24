/**
 * @description: 存储大盘接口请求hook
 * @name {muxi.jth}
 * @date {2022/01/17 11:00}
 */
import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import moment from 'moment';
import * as APIS from '../service';

// 获取gfs大盘数据
export function useGlusterfsClusterInfo() {
  const [queryClusterInfoData, setQueryClusterInfoData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [clusterDataSource, setClusterDataSource] = useState<any>([]);

  const queryGlusterfsClusterInfo = async (clusterCode: string) => {
    setLoading(true);
    await getRequest(APIS.getGlusterfsClusterInfo, { data: { clusterCode } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          setQueryClusterInfoData(dataSource);
          let tableData: any = [];
          for (const key in dataSource?.resourceInfo) {
            if (Object.prototype.hasOwnProperty.call(dataSource?.resourceInfo, key)) {
              const element = dataSource?.resourceInfo[key];
              if (key === 'brick') {
                tableData.push({ type: 'brick', ...element });
              }
              if (key === 'device') {
                tableData.push({ type: 'device', ...element });
              }
              if (key === 'disk') {
                tableData.push({ type: 'disk', online: element?.used, offline: element?.free, total: element?.total });
              }
              if (key === 'node') {
                tableData.push({ type: 'node', ...element });
              }
              if (key === 'volume') {
                tableData.push({
                  type: 'volume',
                  online: element?.started,
                  offline: element?.other,
                  total: element?.total,
                });
              }
            }
          }
          setClusterDataSource(tableData);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryClusterInfoData, clusterDataSource, loading, queryGlusterfsClusterInfo];
}

// 获取节点数据
export function useGlusterfsNodeList() {
  const [queryNodeListData, setQueryNodeListData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryNodeList = (clusterCode: string) => {
    setLoading(true);
    getRequest(APIS.getGlusterfsNodeList, { data: { clusterCode } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          setQueryNodeListData(dataSource);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryNodeListData, loading, queryNodeList];
}

// 获取集群趋势数据
export function useGlusterfsClusterMetrics() {
  const [diskUsedPieData, setDiskUsedPieData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const queryGlusterfsMetrics = async (clusterCode: string) => {
    setLoading(true);
    await getRequest(APIS.getGlusterfsMetrics, {
      data: {
        clusterCode,
        diskViewDay: 7,
      },
    })
      .then((res) => {
        if (res?.success) {
          let diskPieDataArry: any = [];
          let diskUsedPieDataSource = res?.data.diskPie;
          for (const key in diskUsedPieDataSource) {
            if (Object.prototype.hasOwnProperty.call(diskUsedPieDataSource, key)) {
              if (key === 'free') {
                diskPieDataArry.push({
                  value: Number(Number(diskUsedPieDataSource.free[1]).toFixed(1)),
                  type: '可用空间',
                });
              } else {
                diskPieDataArry.push({
                  value: Number(Number(diskUsedPieDataSource.used[1]).toFixed(1)),
                  type: '已用空间',
                });
              }
            }
          }
          setDiskUsedPieData(diskPieDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [diskUsedPieData, loading, queryGlusterfsMetrics];
}

export function useDiskLineInfo() {
  const [diskUsedLineData, setDiskUsedLineData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getDiskLineInfo = async (clusterCode: string, diskViewDay: any) => {
    setLoading(true);
    await getRequest(APIS.getDiskMetrics, {
      data: {
        clusterCode,
        diskViewDay: diskViewDay || 7,
      },
    })
      .then((res) => {
        if (res?.success) {
          let diskLineDataArry: any = [];
          let diskUsedLineDataSource = res?.data.diskLine;
          for (const key in diskUsedLineDataSource) {
            if (Object.prototype.hasOwnProperty.call(diskUsedLineDataSource, key)) {
              const element = diskUsedLineDataSource[key];
            }
            if (key === 'free') {
              diskUsedLineDataSource['free'].map((item: any) => {
                diskLineDataArry.push({
                  time: moment(parseInt(item[0]) * 1000).format('YYYY-MM-DD '),
                  precentage: Number(Number(item[1]).toFixed(1)),
                  category: '可用空间',
                });
              });
            } else if (key === 'used') {
              diskUsedLineDataSource['used'].map((item: any) => {
                diskLineDataArry.push({
                  time: moment(parseInt(item[0]) * 1000).format('YYYY-MM-DD '),
                  precentage: Number(Number(item[1]).toFixed(1)),
                  category: '已用空间',
                });
              });
            }
          }
          setDiskUsedLineData(diskLineDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [diskUsedLineData, loading, getDiskLineInfo];
}

export function useBrickLineInfo() {
  const [brickNumLineData, setBrickNumLineData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getBrickLineInfo = async (clusterCode: string, brickViewDay: any) => {
    setLoading(true);
    await getRequest(APIS.getBrickMetrics, {
      data: {
        clusterCode,
        brickViewDay: brickViewDay || 7,
      },
    })
      .then((res) => {
        if (res?.success) {
          let brickNumLineDataArry: any = [];
          let brickNumLineDataSource = res?.data.brickNumLine;
          brickNumLineDataSource?.map((item: any) => {
            brickNumLineDataArry.push({
              time: moment(parseInt(item[0]) * 1000).format('YYYY-MM-DD '),
              number: Number(item[1]),
            });
          });
          setBrickNumLineData(brickNumLineDataArry);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [brickNumLineData, loading, getBrickLineInfo];
}

export function useVolumeLineInfo() {
  const [volumeNumLineData, setVolumeNumLineData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getVolumeLineInfo = async (clusterCode: string, volumeViewDay: any) => {
    setLoading(true);
    await getRequest(APIS.getVolumeMetrics, {
      data: {
        clusterCode,
        volumeViewDay: volumeViewDay || 7,
      },
    })
      .then((res) => {
        let volumeNumLineDataArry: any = [];
        let volumeNumLineDataSource = res?.data.volumeNumLine;
        volumeNumLineDataSource?.map((item: any) => {
          volumeNumLineDataArry.push({
            time: moment(parseInt(item[0]) * 1000).format('YYYY-MM-DD '),
            number: Number(item[1]),
          });
        });
        setVolumeNumLineData(volumeNumLineDataArry);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [volumeNumLineData, loading, getVolumeLineInfo];
}
