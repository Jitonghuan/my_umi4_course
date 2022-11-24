// dashboard hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:36

import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';
import moment from 'moment';
import { addAPIPrefix } from '@/utils';
//import { getCommonEnvCode, useCommonEnvCode } from '../../hook';
type AnyObject = Record<string, any>;
export const getCommonEnvCode = addAPIPrefix('/opsManage/multiple/common/getEnvCode');

export function useCommonEnvCode(): [string, () => Promise<void>] {
  const [source, setSource] = useState<string>('');
  /** GET 获取envCode */
  const getCommonEnvCode = addAPIPrefix('/opsManage/multiple/common/getEnvCode');
  const queryEnvCode = async () => {
    if (appConfig.IS_Matrix !== 'public') {
      setSource('hbos-test');
    } else {
      await getRequest(getCommonEnvCode).then((result) => {
        if (result?.success) {
          setSource(result.data || '');
        }
      });
    }
  };
  useEffect(() => {
    queryEnvCode();
  }, []);

  return [source, queryEnvCode];
}


// 获取AB集群各院区流量数据
export function useABHistogram(): [AnyObject, boolean, (showLoading?: boolean) => void] {
  const [loading, setLoading] = useState(false);
  const [histogramData, setHistogramData] = useState<any>([]);

  const loadHistogram = useCallback((showLoading = true, commonEnvCode?: string) => {
    showLoading && setLoading(true);
    let envCode: any;
    try {
      getRequest(getCommonEnvCode)
        .then((result) => {
          if (result?.success) {
            envCode = result.data;
          }
        })
        .then(() => {
          getRequest(APIS.getClustersEsData, { data: { envCode: commonEnvCode || envCode } })
            .then((result) => {
              if (!result.success) {
                return;
              }
              setHistogramData(result?.data || {});
            })
            .finally(() => {
              setLoading(false);
            });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    let commonEnvCode = '';
    if (appConfig.IS_Matrix !== 'public') {
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
export function useClusterLineData(): [any, any, boolean, (showLoading?: boolean) => void] {
  const [clusterAData, setClusterAData] = useState<any>([]);
  const [clusterBData, setClusterBData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const loadCluster = (showLoading = true, commonEnvCode?: string) => {
    showLoading && setLoading(true);
    let envCode: any;
    try {
      getRequest(getCommonEnvCode)
        .then((result) => {
          if (result?.success) {
            envCode = result.data;
          }
        })
        .then(() => {
          getRequest(APIS.getClusterEsData, { data: { envCode: commonEnvCode || envCode } })
            .then((result) => {
              if (!result.success) {
                return;
              }
              let dataSource = result?.data;
              let clusterALineData = dataSource?.clusterA?.dataList;
              let clusterBLineData = dataSource?.clusterB?.dataList;
              let clusterATimeStampList: any = [];
              let clusterBTimeStampList: any = [];
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
            });
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let commonEnvCode = '';
    if (appConfig.IS_Matrix !== 'public') {
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
