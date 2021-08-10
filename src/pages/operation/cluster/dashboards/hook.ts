// dashboard hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:36

import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import { result } from '_@types_lodash@4.14.171@@types/lodash';

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
export function useClusterA(): [AnyObject, boolean, any] {
  const [clusterAData, setClusterAData] = useState<AnyObject>({});
  const [loading, setLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState();
  useEffect(() => {
    setLoading(true);
    getRequest(APIS.getAClusterEsData).then((result) => {
      result.data.forEach((item: any) => {
        console.log('遍历结果：', item.buckets);
        setClusterAData(item.buckets);
      });
      // setClusterAData()
    });
  }, []);

  // const clusterAData =[]
  return [clusterAData, loading, timeStamp];
}
