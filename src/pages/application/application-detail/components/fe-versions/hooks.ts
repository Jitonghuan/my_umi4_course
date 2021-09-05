// fe versions hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/04 22:58

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '@/pages/application/service';
import { AppItemVO } from '@/pages/application/interfaces';
import { FeVersionItemVO } from './types';

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
          // appCategoryCode: appData.appCategoryCode,
          pageSize: 50,
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
