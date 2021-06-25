// hook
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/23 20:38

import { useEffect, useState } from 'react';
import { getRequest } from '@/utils/request';
import { SelectOptions } from './interface';
import * as APIS from './service';

export function useAppOptions() {
  const [source, setSource] = useState<SelectOptions[]>([]);

  useEffect(() => {
    getRequest(APIS.getAppList, {
      data: { pageSize: -1 },
    }).then((result) => {
      const { dataSource } = result.data || {};
      const next = (dataSource || []).map((item: any) => ({
        label: item.appName,
        value: item.appCode,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}

export function useEnvOptions() {
  const [source, setSource] = useState<SelectOptions[]>([]);

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

export function useStatusOptions() {
  const [source, setSource] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    setSource([
      { label: '已启用', value: 1 },
      { label: '已关闭', value: 0 },
    ]);
  }, []);

  return [source];
}

export function useCategoryOptions() {
  const [source, setSource] = useState();
}
