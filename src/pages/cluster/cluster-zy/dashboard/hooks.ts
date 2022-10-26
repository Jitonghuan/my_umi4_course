// dashboard hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/30 14:19

import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';

export function useFrameURL(key: number): [string, boolean] {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setUrl('');
    setLoading(true);

    try {
      const result = await getRequest(APIS.getDashboardUrl);
      setUrl(result?.data || '');
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    loadData();
  }, [key]);

  return [url, loading];
}
