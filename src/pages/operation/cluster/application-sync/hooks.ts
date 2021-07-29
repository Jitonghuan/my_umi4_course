// 应用同步 hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/28 10:12

import { useState, useEffect } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';

export function useAppClusterData(appCode?: string): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!appCode) return;
  }, [appCode]);

  return [data, loading];
}
