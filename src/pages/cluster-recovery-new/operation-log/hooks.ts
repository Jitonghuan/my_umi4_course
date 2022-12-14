// operation log hooks
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/11/2 10:38

import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

export function useLogSource(pageIndex: number, pageSize: number,envCode:string): [any[], number, boolean] {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(
    async (envCode: string) => {
      setLoading(true);
      try {
        const result = await getRequest(APIS.queryOperateLog, {
          data: { envCode:envCode, pageIndex, pageSize },
        });

        let resultData = result.data || {};
        if (Array.isArray(resultData)) {
          resultData = { dataSource: resultData, pageInfo: { total: resultData.length } };
        }

        const { dataSource, pageInfo } = resultData;
        setData(dataSource || []);
        setTotal(pageInfo?.total || 0);
      } finally {
        setLoading(false);
      }
    },
    [pageIndex, pageSize,envCode],
  );
  useEffect(() => {
      if(envCode){
        loadData(envCode);
      }  
    
  }, [pageIndex, pageSize,envCode]);



  return [data, total, loading];
}
