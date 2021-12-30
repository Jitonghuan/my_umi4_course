/*
 * @Author: muxi.jth
 * @Date: 2021-12-27 14:10:55
 * @LastEditTime: 2021-12-27 16:04:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-matrix/src/pages/logger/alarm-rules/hooks.ts
 */

import { useState, useCallback, useEffect } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from './service';

export function useRuleListData() {}

export function useAppOptions() {
  const [source, setSource] = useState<IOption[]>([]);

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

export function useEnvOptions(appCode?: string) {
  const [source, setSource] = useState<IOption[]>([]);

  useEffect(() => {
    setSource([]);

    if (!appCode) {
      return;
    }

    getRequest(APIS.getEnvListByAppCode, {
      data: { pageIndex: 1, pageSize: 100, appCode },
    }).then((result) => {
      const { dataSource } = result.data || {};
      const next = (dataSource || []).map((item: any) => ({
        // label: item.envName,
        label: item.envName,
        value: item.envCode,
      }));

      setSource(next);
    });
  }, [appCode]);

  return [source];
}

export function useStatusOptions() {
  const [source, setSource] = useState<IOption<number>[]>([]);

  useEffect(() => {
    setSource([
      { label: '已启用', value: 0 },
      { label: '已关闭', value: 1 },
    ]);
  }, []);

  return [source];
}
