import { useState, useCallback, useEffect } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../../../../service';
interface queryCountDetailParams {
  start: string;
  end: string;
  envCode: string;
  appId?: string;
  instanceIDs?: string[];
  deployName?: string;
  isTotal?: boolean
  podIps?: string[]

}

export const getCountDetail = (params: queryCountDetailParams) =>
  getRequest(APIS.getCountDetail, { data: { ...params } }).then((res: any) => {
    if (res?.success) {
      const dataSource = res?.data;
      return dataSource

    }
    return [];
  });


// 追踪-链路追踪信息 getSearchTracing
interface queryTraceParams {
  start: string;
  end: string;
  envCode: string;
  appID?: string;
  instanceIDs?: string[];
  pageIndex?: number;
  pageSize?: number;
  endpoint?: string
}
export const getTrace = (params: queryTraceParams) => getRequest(APIS.getSearchTracing, { data: { ...params, pageIndex: params?.pageIndex || 1, pageSize: params?.pageSize || 20 } }).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data;
    return dataSource

  }
  return {};
});

export function useCountDetailTable(props: any) {
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const loadData = useCallback(async (extra?: any) => {
    setLoading(true);
    getRequest(APIS.getCountDetail, { data: { ...extra } }).then((res: any) => {
      if (res?.success) {
        let newArr = [];
        (res?.data || []).length ? setIsEmpty(false) : setIsEmpty(true)
        setTotal(res?.data?.length || 0)
        newArr = (res?.data || []).map((item: any) => {
          item.dataSource = [];
          (item?.endpointCPM?.readMetricsValues || []).forEach((val: any) => {
            let curT = item.dataSource.find((i: any) => i.time === val.time);
            if (!curT) {
              curT = { cpm: val.value, time: val.time }
              item.dataSource.push(curT);
            } else {
              Object.assign(curT, { cpm: val.value })
            }
          });
          (item?.endpointAvg?.readMetricsValues || []).forEach((val: any) => {
            let curT = item.dataSource.find((i: any) => i.time === val.time);
            if (!curT) {
              curT = { avg: val.value, time: val.time }
              item.dataSource.push(curT);
            } else {
              Object.assign(curT, { avg: val.value })
            }
          });
          (item?.endpointSR?.readMetricsValues || []).forEach((val: any) => {
            let curT = item.dataSource.find((i: any) => i.time === val.time);
            if (!curT) {
              curT = { sr: val.value, time: val.time }
              item.dataSource.push(curT);
            } else {
              Object.assign(curT, { sr: val.value })
            }
          });
          (item?.endpointFailed?.readMetricsValues || []).forEach((val: any) => {
            let curT = item.dataSource.find((i: any) => i.time === val.time);
            if (!curT) {
              curT = { fail: val.value, time: val.time }
              item.dataSource.push(curT);
            } else {
              Object.assign(curT, { fail: val.value })
            }
          });
          return item;
        })
        setData(newArr);
      }
    }).finally(() => { setLoading(false) });
  }, Object.values(props));

  return [data, total, loading, loadData, isEmpty];
}
