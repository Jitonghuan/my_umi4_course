// route template hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/03 09:09

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '@/pages/application/service';
import { AppItemVO } from '@/pages/application/interfaces';
import { RouteTemplateItemVO } from './types';

export function useRouteItemData(
  appData: AppItemVO,
  envCode?: string,
): [RouteTemplateItemVO | undefined, boolean, () => Promise<void>] {
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

  return [data, loading, loadData];
}
