import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';
import moment from 'moment';
import { addAPIPrefix } from '@/utils';


export const getCommonEnvCode = addAPIPrefix('/opsManage/multiple/common/getEnvCode');
export const queryCommonEnvCode = () =>getRequest(getCommonEnvCode);

// 获取AB集群各院区流量数据
export function useABHistogram(): [any, boolean, (showLoading?: boolean,commonEnvCode?: string) => void] {
    const [loading, setLoading] = useState(false);
    const [histogramData, setHistogramData] = useState<any>([]);
    const loadHistogram = useCallback((showLoading = true, commonEnvCode?: string) => {
      showLoading && setLoading(true);
            getRequest(APIS.getClustersEsData, { data: { envCode: commonEnvCode } })
              .then((result) => {
                if (!result.success) {
                  return;
                }
                setHistogramData(result?.data || {});
              })
              .finally(() => {
                setLoading(false);
              });
    }, []);
    return [histogramData, loading, loadHistogram];
  }


/** A、B集群各院区流量 */
export function useClusterLineData(): [any, any, boolean, (showLoading?: boolean,commonEnvCode?: string) => void] {
    const [clusterAData, setClusterAData] = useState<any>([]);
    const [clusterBData, setClusterBData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const loadCluster = (showLoading = true, commonEnvCode?: string) => {
      showLoading && setLoading(true);
            getRequest(APIS.getClusterEsData, { data: { envCode: commonEnvCode } })
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
            }
   
  
   
  
    return [clusterAData, clusterBData, loading, loadCluster];
  }