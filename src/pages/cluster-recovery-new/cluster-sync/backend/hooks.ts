// 应用同步 hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/28 10:12

import { useState, useEffect } from 'react';
import * as APIS from '../../service';
import { getRequest } from '@/utils/request';
import appConfig from '@/app.config';

export function useAppOptions():[any,(envCode:string)=>any] {
  const [data, setData] = useState<any[]>([]);

  const getAppOptions=(envCode:string)=>{
    getRequest(APIS.queryAppList, { data: { envCode } }).then((result) => {
        const next = (result.data || []).map((item: any) => {
          return { label: item.appCode, value: item.appCode };
        });
        setData(next);
      });
   

  }
        
  
  

  return [data,getAppOptions];
}
