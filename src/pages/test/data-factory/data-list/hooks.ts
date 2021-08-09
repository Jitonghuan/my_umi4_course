// data factory hook
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/14 14:50

import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';

export function useTableData(queryParams: Record<string, any>, pageIndex = 1, pageSize = 20): [any[], number, boolean] {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getRequest(APIS.queryData, {
        data: {
          ...(queryParams || {}),
          pageIndex,
          pageSize,
        },
      });

      const { dataSource, pageInfo } = result.data || {};
      setData(dataSource || []);
      setTotal(pageInfo.total || 0);
    } catch (ex) {
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [queryParams, pageIndex, pageSize]);

  useEffect(() => {
    loadData();
  }, [queryParams, pageIndex, pageSize]);

  return [data, total, loading];
}
