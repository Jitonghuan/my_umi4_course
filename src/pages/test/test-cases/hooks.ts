// test case hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/31 17:15

import { useState, useEffect } from 'react';
import * as APIS from './service';
import { getRequest, postRequest } from '@/utils/request';

export function useProjectOptions(key = Date.now()) {
  const [data, setData] = useState<{ label: string; value: string }[]>();

  useEffect(() => {
    getRequest(APIS.getProjects).then((result) => {
      const data = (result.data || []).map((n: any) => ({
        label: `${n.name} (${n.id})`,
        value: n.id,
      }));

      setData(data);
    });
  }, [key]);

  return [data];
}
