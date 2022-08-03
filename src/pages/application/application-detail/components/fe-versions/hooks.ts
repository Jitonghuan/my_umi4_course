/*
 * @Author: your name
 * @Date: 2022-01-05 20:15:46
 * @LastEditTime: 2022-03-01 11:17:09
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-matrix/src/pages/application/application-detail/components/fe-versions/hooks.ts
 */
// fe versions hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/04 22:58

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '@/pages/application/service';
import { AppItemVO } from '@/pages/application/interfaces';
import { FeVersionItemVO } from './types';
import { EnvDataVO } from '@/pages/application/interfaces';

export function useFeVersions(appData: AppItemVO): [Record<string, FeVersionItemVO[]>, boolean, () => Promise<void>] {
  const [data, setData] = useState<Record<string, FeVersionItemVO[]>>({});
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!appData?.appCode) {
      return setData({});
    }

    setLoading(true);

    try {
      const result = await getRequest(APIS.queryFeVersions, {
        data: {
          appCode: appData.appCode,
          appCategoryCode: appData.appCategoryCode,
          pageSize: 500,
          pageIndex: 1,
        },
      });

      const { dataSource } = result.data || {};
      // 按照 envCode 分组
      const list: FeVersionItemVO[] = dataSource || [];
      const next = list.reduce((prev, curr) => {
        prev[curr.envCode] = prev[curr.envCode] || [];
        prev[curr.envCode].push(curr);
        return prev;
      }, {} as Record<string, FeVersionItemVO[]>);

      setData(next);
    } finally {
      setLoading(false);
    }
  }, [appData]);

  useEffect(() => {
    loadData();
  }, [appData]);

  return [data, loading, loadData];
}

/**
 * 获取应用下的环境列表，返回的数据按 envTypeCode 分组
 */
export function useAppEnvCodeData(appCode?: string): [Record<string, EnvDataVO[]>, boolean] {
  const [data, setData] = useState<Record<string, EnvDataVO[]>>({});
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!appCode) {
      return setData({});
    }

    setLoading(true);
    try {
      const result = await getRequest(APIS.queryAppEnvs, {
        data: {
          appCode,
          pageSize: -1,
        },
      });
      const next: EnvDataVO[] = result.data || [];
      // 根据 envTypeCode 分成多组
      const map: Record<string, EnvDataVO[]> = {};
      next.forEach((n) => {
        if (n.proEnvType === 'benchmark') {
          map[n.envTypeCode] = map[n.envTypeCode] || [];
          map[n.envTypeCode].push(n);
        }
      });
      setData(map);
    } finally {
      setLoading(false);
    }
  }, [appCode]);

  useEffect(() => {
    loadData();
  }, [appCode]);

  return [data, loading];
}
