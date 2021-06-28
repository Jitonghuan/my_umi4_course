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

export function useRuleOptions() {
  const [groupSource, setGroupSource] = useState<
    { label: string; value: string }[]
  >([]);
  const [indexSource, setIndexSource] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    getRequest(APIS.getAlertRule).then((result) => {
      const { Group, Index } = result.data || {};

      setGroupSource(
        (Group || []).map((n: string) => ({ label: n, value: n })),
      );
      setIndexSource(
        (Index || []).map((n: string) => ({ label: n, value: n })),
      );
    });
  }, []);

  return [groupSource, indexSource];
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

// 比较符
export function useOperatorOptions() {
  const [source, setSource] = useState<SelectOptions[]>([]);

  useEffect(() => {
    setSource([
      { label: '=', value: '=' },
      { label: '>', value: '>' },
      { label: '<', value: '<' },
      // { label: '>=', value: '>=' },
      // { label: '<=', value: '<=' },
    ]);
  }, []);

  return [source];
}

export function useLevelOptions() {
  const [source, setSource] = useState<SelectOptions<number>[]>([]);

  useEffect(() => {
    setSource([
      { label: '警告', value: 2 },
      { label: '严重', value: 3 },
      { label: '灾难', value: 4 },
    ]);
  }, []);

  return [source];
}

export function useNotifyTypeOptions() {
  const [source, setSource] = useState<SelectOptions[]>([]);

  useEffect(() => {
    setSource([
      { label: '钉钉', value: '钉钉' },
      { label: '电话', value: '电话' },
    ]);
  }, []);

  return [source];
}
