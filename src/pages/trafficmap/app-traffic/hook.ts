
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';

  
export const queryEnvList = async () => 
   
    await getRequest(APIS.queryEnvList, { data:{pageIndex:-1,pageSize:-1,envModel:"currency-deploy"} })
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data.dataSource || [];
          let option= dataSource?.map((ele:any)=>({
              label:ele?.envName,
              value:ele?.envCode
          }))
          return option;
        
        }
        return [];
      })
    