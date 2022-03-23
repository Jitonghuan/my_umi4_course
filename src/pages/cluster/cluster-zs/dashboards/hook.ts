// dashboard hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:36

import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import moment from 'moment';
import { useCommonEnvCode } from '../../hook';
type AnyObject = Record<string, any>;

// 获取AB集群各院区流量数据
export function useABHistogram(): [AnyObject, boolean, (showLoading?: boolean) => Promise<any>] {
  const [loading, setLoading] = useState(false);
  const [histogramData, setHistogramData] = useState<any>([]);
  const [commonEnvCode] = useCommonEnvCode();

  const loadHistogram = useCallback((showLoading = true) => {
    showLoading && setLoading(true);
    return getRequest(APIS.getClustersEsData, { data: { envCode: commonEnvCode } })
      .then((result) => {
        setHistogramData(result?.data || {});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadHistogram();
  }, []);
  return [histogramData, loading, loadHistogram];
}

/** A、B集群各院区流量 */
export function useClusterLineData(): [any, any, boolean, (showLoading?: boolean) => Promise<void>] {
  const [clusterAData, setClusterAData] = useState<any>([]);
  const [clusterBData, setClusterBData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [commonEnvCode] = useCommonEnvCode();
  const loadCluster = (showLoading = true) => {
    showLoading && setLoading(true);
    return getRequest(APIS.getClusterEsData, { data: { envCode: commonEnvCode } })
      .then((result) => {
        let dataSource = result?.data;
        let clusterALineData = dataSource?.clusterA?.dataList;
        let clusterBLineData = dataSource?.clusterB?.dataList;
        let clusterATimeStampList;
        let clusterBTimeStampList;
        (dataSource?.clusterA?.timeList || [])
          ?.map((el: any) => {
            let time = moment(parseInt(el)).format('HH:mm:ss');
            clusterATimeStampList.push(time);
          })(dataSource?.clusterB?.timeList || [])
          ?.map((el: any) => {
            let time = moment(parseInt(el)).format('HH:mm:ss');
            clusterBTimeStampList.push(time);
          });
        let clusterATotalDataSource = {
          clusterADataSource: clusterALineData,
          clusterATimeStamp: clusterATimeStampList,
        };

        let clusterBTotalDataSource = {
          clusterBDataSource: clusterBLineData,
          clusterBTimeStamp: clusterBTimeStampList,
        };
        setClusterAData(clusterATotalDataSource);
        setClusterBData(clusterBTotalDataSource);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCluster();
  }, []);

  return [clusterAData, clusterBData, loading, loadCluster];
}
