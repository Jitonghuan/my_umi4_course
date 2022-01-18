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

  const queryGlusterfsClusterInfo = (clusterCode: string) => {
    setLoading(true);
    getRequest(APIS.getGlusterfsClusterInfo, { data: { clusterCode } })
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          setQueryClusterInfoData(dataSource);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryClusterInfoData, loading, queryGlusterfsClusterInfo];
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
  const [diskUsedLineData, setDiskUsedLineData] = useState<any>([]);
  const [volumeNumLineData, setVolumeNumLineData] = useState<any>([]);
  const [brickNumLineData, setBrickNumLineData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const queryGlusterfsMetrics = (clusterCode: string) => {
    setLoading(true);
    getRequest(APIS.getGlusterfsMetrics, { data: { clusterCode } })
      .then((res) => {
        if (res?.success) {
          let diskPieDataArry: any = [];
          let diskUsedPieDataSource = res?.data.diskUsedPie;
          diskUsedPieDataSource?.map((item: any) => {
            diskPieDataArry.push({
              time: moment(parseInt(item[0]) * 1000).format('HH:mm'),
              precentage: Number(Number(item[1]).toFixed(1)),
              category: '使用量',
            });
          });
          setDiskUsedPieData(diskPieDataArry);

          let diskLineDataArry: any = [];
          let diskUsedLineDataSource = res?.data.diskUsedLine;
          diskUsedLineDataSource?.map((item: any) => {
            diskLineDataArry.push({
              time: moment(parseInt(item[0]) * 1000).format('HH:mm'),
              precentage: Number(Number(item[1]).toFixed(1)),
              category: '使用量',
            });
          });
          setDiskUsedLineData(diskLineDataArry);

          let volumeNumLineDataArry: any = [];
          let volumeNumLineDataSource = res?.data.volumeNumLine;
          volumeNumLineDataSource?.map((item: any) => {
            volumeNumLineDataArry.push({
              time: moment(parseInt(item[0]) * 1000).format('HH:mm'),
              precentage: Number(Number(item[1]).toFixed(1)),
              category: '使用量',
            });
          });
          setVolumeNumLineData(volumeNumLineDataArry);

          let brickNumLineDataArry: any = [];
          let brickNumLineDataSource = res?.data.brickNumLine;
          brickNumLineDataSource?.map((item: any) => {
            brickNumLineDataArry.push({
              time: moment(parseInt(item[0]) * 1000).format('HH:mm'),
              precentage: Number(Number(item[1]).toFixed(1)),
              category: '使用量',
            });
          });
          setBrickNumLineData(brickNumLineDataSource);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [diskUsedPieData, diskUsedLineData, volumeNumLineData, brickNumLineData, loading, queryGlusterfsMetrics];
}
