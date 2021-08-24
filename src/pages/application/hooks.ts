// application hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/24 09:21

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import { queryBizData } from '@/layouts/basic-layout/service';
import { queryAppsUrl, queryMyAppsUrl } from './service';

// 获取应用分组选项
export function useAppGroupOptions(categoryCode?: string): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData([]);
    if (!categoryCode) return;

    setLoading(true);
    getRequest(queryBizData, {
      data: { categoryCode },
    })
      .then((result) => {
        const { dataSource } = result.data || {};
        const next = (dataSource || []).map((item: any) => ({
          ...item,
          value: item.groupCode,
          label: item.groupName,
        }));

        setData(next);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryCode]);

  return [data, loading];
}

// 获取应用列表
export function useAppListData(
  params: Record<string, any>,
  pageIndex = 1,
  pageSize = 20,
): [any[], number, boolean, (extra?: any) => Promise<any>] {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(
    async (extra?: any) => {
      const { requestType, ...others } = params || {};
      const url = requestType === 'mine' ? queryMyAppsUrl : queryAppsUrl;
      try {
        setLoading(true);
        const result = await getRequest(url, {
          data: {
            ...others,
            ...extra,
            pageIndex,
            pageSize,
          },
        });
        const { dataSource, pageInfo } = result.data || {};
        setData(dataSource || []);
        setTotal(pageInfo?.total || 0);
      } catch (ex) {
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [params, pageIndex, pageSize],
  );

  useEffect(() => {
    loadData({});
  }, [params, pageIndex, pageSize]);

  return [data, total, loading, loadData];
}
