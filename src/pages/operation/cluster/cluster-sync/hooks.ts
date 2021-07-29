// cluster sync hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/29 16:12

import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';

export function useTableData(): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getRequest(APIS.diffClusterApp)
      .then((result) => {
        const resultData = result.data || {};
        const next = Object.keys(resultData).map((appName: string) => {
          return {
            appName,
            ...resultData[appName],
          };
        });

        setData(next);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [data, loading];
}
