
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
interface queryNodeParams{
    start:number;
    end:number;
    envCode:string;
    appCode:string
}
export const queryNodeList = (params: queryNodeParams) =>
getRequest(APIS.queryPodInfoApi, { data: {...params,pageSize:1000} }).then((res: any) => {
  if (res?.success) {
    const dataSource  = res?.data;
    return dataSource
    
  }
  return [];
});

