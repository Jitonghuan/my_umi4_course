// hook
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 16:49

import { useEffect, useState } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from './service';

export function useEnvOptions() {
  const [source, setSource] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    getRequest(APIS.getEnvList, {
      data: { pageIndex: 1, pageSize: 100 },
    }).then((result) => {
      const { dataSource } = result.data || {};
      const next = (dataSource || []).map((item: any) => ({
        label: item.envCode,
        value: item.envCode,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}

export function useLogStoreOptions(envCode?: string) {
  const [source, setSource] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    setSource([]);

    if (!envCode) return;

    getRequest(APIS.ruleIndexOptions, {
      data: { envCode },
    }).then((result) => {
      const { Index } = result.data || {};
      const next = (Index || []).map((n: string) => ({
        label: n,
        value: n,
      }));

      setSource(next);
    });
  }, [envCode]);

  return [source];
}

export function useFrameUrl(envCode?: string, logStore?: string): [string, boolean] {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!envCode || !logStore) {
      setLoading(false);
      setUrl('');
      return;
    }

    setLoading(true);
    getRequest(APIS.getSearchUrl, {
      data: { envCode, logStore },
    })
      .then((result) => {
        setUrl(result.data || '');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [envCode, logStore]);

  return [url, loading];
}

/** 日志检索柱状图 */
type AnyObject = Record<string, any>;
export function useLoggerData(): [AnyObject, boolean] {
  const [data, setData] = useState<AnyObject>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRequest(APIS.logHistorm, {
      data: { envCode: '', indexMode: '', startTime: '', endTime: '', querySql: '', filterIs: '', fllterNot: '' },
    })
      .then((result) => {
        if (result.success) {
          let aggregationsArry = [];

          setData(result.data.aggregations.aggs_over_time.buckets || {});
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [data, loading];
}
