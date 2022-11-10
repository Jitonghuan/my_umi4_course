
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

      export const queryTrafficList = async (params:{envCode:string,start:string,end:string}) => 
     
    await getRequest(APIS.getTrafficList, { data:params })
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data || [];
         
          return dataSource;
        
        }
        return [];
      })
    