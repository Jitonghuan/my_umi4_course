// cluster sync hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/29 16:12

import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';

function getCacheData(key: string, limit = 12e4): { timestamp: number; data: any } {
  const cacheStr = sessionStorage.getItem(key);
  if (!cacheStr) return null as any;

  const cacheData = JSON.parse(cacheStr);
  if (Date.now() - cacheData.timestamp > limit) {
    sessionStorage.removeItem(key);
    return null as any;
  }

  return cacheData;
}

export function useTableData(): [any[], string, boolean, (forceReload?: boolean) => Promise<void>] {
  const [data, setData] = useState<any[]>([]);
  const [fromCache, setFromCache] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (forceReload = false) => {
    if (!forceReload) {
      const cache = getCacheData('DIFF_CLUSTER_APP');
      if (cache) {
        setData(cache.data);
        setFromCache(moment(cache.timestamp).format('HH:mm:ss'));
        return;
      }
    }

    setLoading(true);
    try {
      const result = await getRequest(APIS.diffClusterApp);
      const resultData = result.data || {};
      const next = Object.keys(resultData).map((appName: string) => {
        return {
          appName,
          ...resultData[appName],
        };
      });

      sessionStorage.setItem('DIFF_CLUSTER_APP', JSON.stringify({ timestamp: Date.now(), data: next }));
      setFromCache('');
      setData(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data, fromCache, loading, loadData];
}
