// prometheus editor hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/17 09:17

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import { queryappManageList, queryappManageEnvList } from '../../services';

export function useAppCodeOptions() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(queryappManageList, {
      data: { pageSize: -1 },
    }).then((result) => {
      const { dataSource } = result.data || {};
      const next = (dataSource || []).map((item: any) => ({
        label: item.appCode,
        value: item.appCode,
        key: item.appCode,
      }));
      setData(next);
    });
  }, []);

  return [data];
}

export function useEnvCodeOptions(appCode?: string): [IOption[], boolean] {
  const [data, setData] = useState<IOption[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (appCode?: string) => {
    setData([]);
    if (!appCode) return;
    setLoading(true);
    try {
      const result = await getRequest(queryappManageEnvList, {
        data: { appCode, pageSize: -1 },
      });
      const { dataSource } = result.data || {};
      const next = (dataSource || []).map((item: any) => ({
        label: item.envCode,
        value: item.envCode,
        key: item.envCode,
      }));
      setData(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(appCode);
  }, [appCode]);

  return [data, loading];
}

export function useIntervalOptions() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    setData([
      { label: '15s', value: '15s', key: '15s' },
      { label: '30s', value: '30s', key: '30s' },
      { label: '60s', value: '60s', key: '60s' },
    ]);
  }, []);

  return [data];
}
