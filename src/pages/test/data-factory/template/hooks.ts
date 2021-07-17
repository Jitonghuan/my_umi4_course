// data factory hook
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/14 14:50

import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';

export function useTableData(queryParams: Record<string, any>): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!queryParams) return;

    try {
      setLoading(true);
      const result = await getRequest(APIS.queryDataFactory, {
        data: queryParams,
      });
      setData(result.data || []);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    loadData();
  }, [queryParams]);

  return [data, loading];
}
