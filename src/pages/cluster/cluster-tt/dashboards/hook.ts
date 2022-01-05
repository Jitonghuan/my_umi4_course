// dashboard hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:36

import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import moment from 'moment';
type AnyObject = Record<string, any>;

// 获取AB集群各院区流量数据
export function useABHistogram(): [AnyObject, boolean, (showLoading?: boolean) => Promise<any>] {
  const [loading, setLoading] = useState(false);
  const [histogramData, setHistogramData] = useState(<any>[{}]);

  const loadHistogram = useCallback((showLoading = true) => {
    showLoading && setLoading(true);
    return getRequest(APIS.getCurrentClusterTrafficData, { data: { envCode: 'tt-health' } })
      .then((result) => {
        setHistogramData(result.data || {});
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

/** A集群各院区流量 */
export function useClusterA(): [any, boolean, (showLoading?: boolean) => Promise<void>, any] {
  const [clusterAData, setClusterAData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState<any>([]);
  const loadClusterA = (showLoading = true) => {
    showLoading && setLoading(true);

    return getRequest(APIS.getCurrentClusterTrafficDataSet, {
      data: {
        envCode: 'tt-health',
        cluster: 'A',
      },
    })
      .then((result) => {
        let dataList = result?.data;
        let clusterADataList: any = [];
        let timeStampList: any = [];
        let a_ccjd_cnt: any = [];
        let a_pqz_cnt: any = [];
        let a_qt_cnt: any = [];
        let a_ty_mzl_cnt: any = [];
        let a_ty_qtl_cnt: any = [];
        let a_ty_yjl_cnt: any = [];
        let a_ty_zyl_cnt: any = [];
        let a_xzqt_cnt: any = [];

        dataList.map((item: any) => {
          a_ccjd_cnt.push(item.ccjd_cnt);
          a_pqz_cnt.push(item.pqz_cnt);
          a_qt_cnt.push(item.qt_cnt);
          a_ty_mzl_cnt.push(item.ty_mzl_cnt);
          a_ty_qtl_cnt.push(item.ty_qtl_cnt);
          a_ty_yjl_cnt.push(item.ty_yjl_cnt);
          a_ty_zyl_cnt.push(item.ty_zyl_cnt);
          a_xzqt_cnt.push(item.xzqt_cnt);
          timeStampList.push(item?.time);
        });
        clusterADataList.push(
          a_ccjd_cnt,
          a_pqz_cnt,
          a_qt_cnt,
          a_ty_mzl_cnt,
          a_ty_qtl_cnt,
          a_ty_yjl_cnt,
          a_ty_zyl_cnt,
          a_xzqt_cnt,
          timeStampList,
        );
        setClusterAData(clusterADataList);
        setTimeStamp(timeStampList);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadClusterA();
  }, []);

  return [clusterAData, loading, loadClusterA, timeStamp];
}

/** B集群各院区流量 */
export function useClusterB(): [any, boolean, (showLoading?: boolean) => Promise<void>, any] {
  const [clusterBData, setClusterBData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState<any>([]);
  const loadClusterB = (showLoading = true) => {
    showLoading && setLoading(true);

    return getRequest(APIS.getCurrentClusterTrafficDataSet, {
      data: {
        envCode: 'tt-health',
        cluster: 'B',
      },
    })
      .then((result) => {
        let dataList = result?.data;
        let clusterBDataList: any = [];
        let timeStampList: any = [];
        let b_ccjd_cnt: any = [];
        let b_pqz_cnt: any = [];
        let b_qt_cnt: any = [];
        let b_ty_mzl_cnt: any = [];
        let b_ty_qtl_cnt: any = [];
        let b_ty_yjl_cnt: any = [];
        let b_ty_zyl_cnt: any = [];
        let b_xzqt_cnt: any = [];

        dataList.map((item: any) => {
          b_ccjd_cnt.push(item.ccjd_cnt);
          b_pqz_cnt.push(item.pqz_cnt);
          b_qt_cnt.push(item.qt_cnt);
          b_ty_mzl_cnt.push(item.ty_mzl_cnt);
          b_ty_qtl_cnt.push(item.ty_qtl_cnt);
          b_ty_yjl_cnt.push(item.ty_yjl_cnt);
          b_ty_zyl_cnt.push(item.ty_zyl_cnt);
          b_xzqt_cnt.push(item.xzqt_cnt);
          timeStampList.push(item?.time);
        });
        clusterBDataList.push(
          b_ccjd_cnt,
          b_pqz_cnt,
          b_qt_cnt,
          b_ty_mzl_cnt,
          b_ty_qtl_cnt,
          b_ty_yjl_cnt,
          b_ty_zyl_cnt,
          b_xzqt_cnt,
          timeStampList,
        );

        setClusterBData(clusterBDataList);
        setTimeStamp(timeStampList);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadClusterB();
  }, []);

  return [clusterBData, loading, loadClusterB, timeStamp];
}
