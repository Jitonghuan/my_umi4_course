import React, { useState, useEffect, useCallback } from 'react';
import { graphTableList } from './service';

export const useGrafhTable = (
  params: Record<string, any>,
  pageIndex = 1,
  pageSize = 20,
): [any[], number, boolean, (extra?: any) => Promise<any>] => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(
    async (extra?: any) => {
      const { ...others } = params || {};
      const requestData = { ...others, ...extra, pageIndex, pageSize };
      if (requestData?.clusterCode) {
        setLoading(true)
        try {
          const res = await graphTableList(requestData)
          setData(res?.data.dataSource || [])
          setTotal(res?.data?.pageInfo?.total || 0)
          setLoading(false)
        } catch (e) {
          setLoading(false)
        }
      }
    },
    [params, pageIndex, pageSize],
  );

  useEffect(() => {
    loadData({});
  }, [params, pageIndex, pageSize]);

  return [data, total, loading, loadData];
}
