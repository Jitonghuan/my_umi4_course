// 前端应用同步 hooks

import { useState, useEffect } from 'react';
import * as APIS from '../../service';
import { getRequest } from '@/utils/request';

export function useAppOptions() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getRequest(APIS.getAppList, { data: { appType: 'frontend', pageIndex: -1, pageSize: -1 } }).then((result) => {
      const next = (result?.data?.dataSource || []).map((item: any) => {
        return { label: item.appCode, value: item.appCode, info: item };
      });
      setData(next);
    });
  }, []);

  return [data];
}
