// dashboard hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:36

import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';
import moment from 'moment';
import { getCommonEnvCode, useCommonEnvCode } from '../../hook';
type AnyObject = Record<string, any>;

// 获取AB集群各院区流量数据
export function useABHistogram(): [AnyObject, boolean, (showLoading?: boolean) => Promise<any>] {
  const [loading, setLoading] = useState(false);
  const [histogramData, setHistogramData] = useState<any>([]);

  const loadHistogram = useCallback((showLoading = true, commonEnvCode?: string) => {
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
    let commonEnvCode = '';
    if (appConfig.IS_Matrix !== 'public') {
      commonEnvCode = 'hbos-test';
    } else {
      getRequest(getCommonEnvCode).then((result) => {
        if (result?.success) {
          commonEnvCode = result.data;
          loadHistogram(true, commonEnvCode);
        }
      });
    }
  }, []);
  return [histogramData, loading, loadHistogram];
}

/** A、B集群各院区流量 */
export function useClusterLineData(): [any, any, boolean, (showLoading?: boolean) => Promise<void>] {
  const [clusterAData, setClusterAData] = useState<any>([]);
  const [clusterBData, setClusterBData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const loadCluster = (showLoading = true, commonEnvCode?: string) => {
    showLoading && setLoading(true);

    return getRequest(APIS.getClusterEsData, { data: { envCode: commonEnvCode } })
      .then((result) => {
        let dataSource = result?.data;
        let clusterALineData = dataSource?.clusterA?.dataList;
        let clusterBLineData = dataSource?.clusterB?.dataList;
        let clusterATimeStampList;
        let clusterBTimeStampList;
        (dataSource?.clusterA?.timeList || [])?.map((el: any) => {
          let time = moment(parseInt(el)).format('HH:mm:ss');
          clusterATimeStampList.push(time);
        });
        (dataSource?.clusterB?.timeList || [])?.map((el: any) => {
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
      })
      .catch((error) => {
        console.error('error', error);
      });
  };

  useEffect(() => {
    let commonEnvCode = '';
    if (appConfig.IS_Matrix !== 'public') {
      commonEnvCode = 'hbos-test';
    } else {
      getRequest(getCommonEnvCode).then((result) => {
        if (result?.success) {
          commonEnvCode = result.data;
          loadCluster(true, commonEnvCode);
        }
      });
    }
  }, []);

  return [clusterAData, clusterBData, loading, loadCluster];
}
