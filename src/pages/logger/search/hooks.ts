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
        label: item.envName,
        value: item.envCode,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}

export function useLogStoreOptions() {
  const [source, setSource] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    getRequest(APIS.getAlertRule).then((result) => {
      const { Index } = result.data || {};
      const next = (Index || []).map((n: string) => ({
        label: n,
        value: n,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}

export function useFrameUrl(envCode?: string, logStore?: string): [string, boolean] {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!envCode || !logStore) return;

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
