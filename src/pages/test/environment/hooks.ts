// env hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/31 10:58

import { useState, useEffect } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';

export function useEnvCodeOptions(key: number = 1) {
  const [data, setData] = useState<{ label: string; value: string }[]>();

  useEffect(() => {
    getRequest(APIS.envCodeList, {
      data: { pageSize: 99 },
    }).then((result) => {
      const { dataSource } = result.data || {};
      const list = (dataSource || []).map((item: any) => ({
        label: `${item.envName} (${item.envCode})`,
        value: item.envCode,
        // label: item.envName,
        // value: `${item.id}`,
      }));

      setData(list);
    });
  }, [key]);

  return [data];
}
