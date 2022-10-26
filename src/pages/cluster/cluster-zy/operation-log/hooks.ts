// operation log hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/29 15:38

import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';

export function useLogSource(searchParams: any, pageIndex: number, pageSize: number): [any[], number, boolean] {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getRequest(APIS.queryOperateLog, {
        data: { ...searchParams, pageIndex, pageSize },
      });

      let resultData = result?.data || {};
      if (Array.isArray(resultData)) {
        resultData = { dataSource: resultData, pageInfo: { total: resultData.length } };
      }

      const { dataSource, pageInfo } = resultData;
      setData(dataSource || []);
      setTotal(pageInfo?.total || 0);
    } finally {
      setLoading(false);
    }
  }, [searchParams, pageIndex, pageSize]);

  useEffect(() => {
    loadData();
  }, [searchParams, pageIndex, pageSize]);

  return [data, total, loading];
}
