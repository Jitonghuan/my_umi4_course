// 应用同步 hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/28 10:12

import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';

export function useAppOptions() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getRequest(APIS.queryAppList).then((result) => {
      const next = (result?.data || []).map((item: any) => {
        return { label: item.appCode, value: item.appCode };
      });
      setData(next);
    });
  }, []);

  return [data];
}
