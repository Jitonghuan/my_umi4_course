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
  const [source, setSource] = useState<SelectOptions<number>[]>([]);

  useEffect(() => {
    setSource([
      { label: '已启用', value: 1 },
      { label: '已关闭', value: 0 },
    ]);
  }, []);

  return [source];
}

export function useCategoryOptions() {
  const [source, setSource] = useState<SelectOptions<number>[]>([]);

  useEffect(() => {
    setSource([
      { label: 'SQL异常', value: 1 },
      { label: '服务异常', value: 2 },
    ]);
  }, []);

  return [source];
}

export function useIntervalUnitOptions() {
  const [source, setSource] = useState<SelectOptions[]>([]);

  useEffect(() => {
    setSource([
      { label: '秒', value: 'seconds' },
      { label: '分钟', value: 'minutes' },
      { label: '小时', value: 'hours' },
      { label: '天', value: 'days' },
    ]);
  }, []);

  return [source];
}

export function useLevelOptions() {
  const [source, setSource] = useState<SelectOptions<number>[]>([]);

  useEffect(() => {
    setSource([
      { label: '低', value: 1 },
      { label: '中', value: 2 },
      { label: '高', value: 3 },
    ]);
  }, []);

  return [source];
}

export function useNotifyTypeOptions() {
  const [source, setSource] = useState<SelectOptions<number>[]>([]);

  useEffect(() => {
    setSource([
      { label: '钉钉', value: 1 },
      { label: '邮件', value: 2 },
      { label: '短信', value: 3 },
      { label: '电话', value: 4 },
    ]);
  }, []);

  return [source];
}
