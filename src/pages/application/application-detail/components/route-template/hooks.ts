// route template hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/03 09:09

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '@/pages/application/service';
import { EnvDataVO } from '@/pages/application/application-detail/types';
import { AppItemVO } from '@/pages/application/interfaces';
import { RouteTemplateItemVO } from './types';

// 获取应用下的环境列表
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
      const next: EnvDataVO[] = result.data?.dataSource || [];
      // 根据 envTypeCode 分成多组
      const map: Record<string, EnvDataVO[]> = {};
      next.forEach((n) => {
        map[n.envTypeCode] = map[n.envTypeCode] || [];
        map[n.envTypeCode].push(n);
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

export function useRouteItemData(appData: AppItemVO, envCode?: string): [RouteTemplateItemVO | undefined, boolean] {
  const [data, setData] = useState<RouteTemplateItemVO>();
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!appData?.appCode || !envCode) {
      return setData(undefined);
    }

    setLoading(true);

    try {
      const result = await getRequest(APIS.queryFeRouteTemplate, {
        data: {
          appCode: appData.appCode,
          appCategoryCode: appData.appCategoryCode,
          envCode,
          pageIndex: 1,
          pageSize: 1,
        },
      });

      const { dataSource } = result.data || {};
      setData(dataSource?.[0]);
    } finally {
      setLoading(false);
    }
  }, [appData, envCode]);

  useEffect(() => {
    loadData();
  }, [appData, envCode]);

  return [data, loading];
}
