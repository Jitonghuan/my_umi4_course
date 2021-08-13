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
    if (!queryParams) return;

    try {
      setLoading(true);
      const result = await getRequest(APIS.queryDataFactory, {
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

export function useRecordList(
  id: number,
  createUser?: null,
  pageIndex = 1,
  pageSize = 20,
  filterRange?: moment.Moment[],
): [any[], number, boolean] {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const params: any = { id, createUser, pageIndex, pageSize };
      if (filterRange?.length) {
        params.startTime = filterRange[0].format('YYYY-MM-DD HH:mm:ss');
        params.endTime = filterRange[1].format('YYYY-MM-DD HH:mm:ss');
      }

      const result = await getRequest(APIS.getRecords, {
        data: params,
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
  }, [id, createUser, pageIndex, pageSize, filterRange]);

  useEffect(() => {
    loadData();
  }, [id, createUser, pageIndex, pageSize, filterRange]);

  return [data, total, loading];
}
