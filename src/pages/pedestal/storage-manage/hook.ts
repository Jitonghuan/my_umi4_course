import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import { useGlusterfsList } from './service';
// 获取使用GFS的集群code
export function useGlusterfsClusterCode() {
  const [queryClusterCodeData, setQueryClusterCodeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryGlusterfsClusterCode = async () => {
    setLoading(true);
    await getRequest(useGlusterfsList)
      .then((res) => {
        if (res?.success) {
          let dataSource = res?.data;
          const source = (dataSource || []).map((n: any) => ({
            label: n,
            value: n,
          }));
          setQueryClusterCodeData(source);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryClusterCodeData, loading, queryGlusterfsClusterCode];
}
