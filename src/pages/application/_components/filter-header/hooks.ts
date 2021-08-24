// filter header hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/23 17:07

import { useState, useEffect } from 'react';
import { getRequest } from '@/utils/request';
import { queryBizData } from '@/layouts/basic-layout/service';

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
