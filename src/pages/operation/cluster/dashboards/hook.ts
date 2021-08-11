// dashboard hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:36

import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import { result } from '_@types_lodash@4.14.171@@types/lodash';
import moment from 'moment';
type AnyObject = Record<string, any>;

// 获取AB集群各院区流量数据
export function useABHistogram(): [AnyObject, boolean] {
  const [loading, setLoading] = useState(false);
  const [histogramData, setHistogramData] = useState(<any>[{}]);
  useEffect(() => {
    setLoading(true);
    getRequest(APIS.getClustersEsData)
      .then((result) => {
        setHistogramData(result.data || {});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return [histogramData, loading];
}

/** A集群各院区流量 */
export function useClusterA(): [any, boolean, any] {
  const [clusterAData, setClusterAData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState<any>([]);
  useEffect(() => {
    setLoading(true);
    getRequest(APIS.getAClusterEsData)
      .then((result) => {
        let dataList = result.data;
        let timeStampList = [];
        let clusterADataList = [];
        let clusterAZJ = [];
        let clusterAZJWX = [];
        let clusterYH = [];
        let clusterYHWX = [];
        let clusterAQCCZ = [];
        let clusterAQCCZWX = [];

        for (let index = 0; index < dataList.length; index++) {
          let dataObj = dataList[index].buckets;
          let time = moment(parseInt(dataList[index].timeStamp)).format('YYYY/MM/DD hh:mm:ss');
          timeStampList.push(time);
          for (const key in dataObj) {
            switch (key) {
              case '之江':
                clusterAZJ.push(dataObj[key]);
                break;
              case '之江无线':
                clusterAZJWX.push(dataObj[key]);
                break;
              case '余杭':
                clusterYH.push(dataObj[key]);
                break;
              case '余杭无线':
                clusterYHWX.push(dataObj[key]);
                break;
              case '庆春城站':
                clusterAQCCZ.push(dataObj[key]);
                break;
              case '庆春城站无线':
                clusterAQCCZWX.push(dataObj[key]);
                break;
              default:
                break;
            }
          }
        }

        clusterADataList.push(
          clusterAZJ,
          clusterAZJWX,
          clusterYH,
          clusterYHWX,
          clusterAQCCZ,
          clusterAQCCZWX,
          timeStampList,
        );
        setClusterAData(clusterADataList);
        setTimeStamp(timeStampList);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // const clusterAData =[]
  return [clusterAData, timeStamp, loading];
}

/** B集群各院区流量 */
export function useClusterB(): [any, boolean, any] {
  const [clusterBData, setClusterBData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState<any>([]);
  useEffect(() => {
    setLoading(true);
    getRequest(APIS.getBClusterEsData)
      .then((result) => {
        let dataList = result.data;
        let timeStampList = [];
        let clusterBDataList = [];
        let clusterAZJ = [];
        let clusterAZJWX = [];
        let clusterYH = [];
        let clusterYHWX = [];
        let clusterAQCCZ = [];
        let clusterAQCCZWX = [];

        for (let index = 0; index < dataList.length; index++) {
          let dataObj = dataList[index].buckets;
          let time = moment(parseInt(dataList[index].timeStamp)).format('YYYY/MM/DD hh:mm:ss');
          timeStampList.push(time);
          for (const key in dataObj) {
            switch (key) {
              case '之江':
                clusterAZJ.push(dataObj[key]);
                break;
              case '之江无线':
                clusterAZJWX.push(dataObj[key]);
                break;
              case '余杭':
                clusterYH.push(dataObj[key]);
                break;
              case '余杭无线':
                clusterYHWX.push(dataObj[key]);
                break;
              case '庆春城站':
                clusterAQCCZ.push(dataObj[key]);
                break;
              case '庆春城站无线':
                clusterAQCCZWX.push(dataObj[key]);
                break;
              default:
                break;
            }
          }
        }

        clusterBDataList.push(
          clusterAZJ,
          clusterAZJWX,
          clusterYH,
          clusterYHWX,
          clusterAQCCZ,
          clusterAQCCZWX,
          timeStampList,
        );
        setClusterBData(clusterBDataList);
        setTimeStamp(timeStampList);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [clusterBData, timeStamp, loading];
}
