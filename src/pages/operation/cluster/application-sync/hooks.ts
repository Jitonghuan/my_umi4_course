// 应用同步 hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/28 10:12

import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';

export function useAppOptions() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getRequest(APIS.queryAppList).then((result) => {
      const next = (result.data || []).map((item: any) => {
        return { label: item.appName, value: item.appCode };
      });
      setData(next);
    });
  }, []);

  return [data];
}

export function useAppClusterData(appCode?: string): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!appCode) {
      setData([]);
      setLoading(false);
      return;
    }

    getRequest(APIS.singleAppDiff, {
      data: { appCode },
    })
      .then((result) => {
        const source = result.data || {};
        const next = Object.keys(source).map((cluster) => {
          return { cluster, ...source[cluster] };
        });
        setData(next);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appCode]);

  return [data, loading];
}
