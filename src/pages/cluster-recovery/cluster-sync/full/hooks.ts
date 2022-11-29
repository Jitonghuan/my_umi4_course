// cluster-tt sync 集群同步 hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/9 10:33

import { useState,  useCallback } from 'react';
import moment from 'moment';
import * as APIS from '../../service';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

function getCacheData(key: string, limit = 6e5): { timestamp: number; data: any } {
  const cacheStr = sessionStorage.getItem(key);
  if (!cacheStr) return null as any;

  const cacheData = JSON.parse(cacheStr);
  if (Date.now() - cacheData.timestamp > limit) {
    sessionStorage.removeItem(key);
    return null as any;
  }

  return cacheData;
}

export function useTableData(): [any[], string, boolean, boolean, (fromCache?: boolean) => Promise<void>] {
  const [data, setData] = useState<any[]>([]);
  const [fromCache, setFromCache] = useState<string>('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (fromCache = false) => {
    if (fromCache) {
      const cache = getCacheData('DIFF_CLUSTER_APP', 20 * 60 * 1000);
      if (cache) {
        setData(cache.data);
        setFromCache(moment(cache.timestamp).format('HH:mm:ss'));
        setCompleted(true);
      } else {
        setData([]);
      }
      return;
    }

    setLoading(true);
    try {
      //集群应用比对
            getRequest(APIS.diffClusterApp, { data: { envCode: commonEnvCode } }).then((res) => {
              if (res?.success) {
                const resultData = res?.data || [];
                const next = resultData?.map((item: any, index: number) => {
                  const appDiffInfo = Object.keys(item);
                  let appName = appDiffInfo[0];
                  return { appName, ...item[appName] };
                });
                sessionStorage.setItem('DIFF_CLUSTER_APP', JSON.stringify({ timestamp: Date.now(), data: next }));
                setFromCache('');
                setData(next);
              }
            })
        
      }finally {
        setLoading(false);
        setCompleted(true);
      };
    },[])
 
   
  return [data, fromCache, loading, completed, loadData];
}
