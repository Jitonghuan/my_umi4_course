import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../../service';
//getCountDetail
interface queryCountDetailParams{
    start:string;
    end:string;
    envCode:string;
    appId?:string;
    instanceIDs?:string[];
    
  }
  //getCountOverview
  export const getCountDetail = (params: queryCountDetailParams) =>
  getRequest(APIS.getCountDetail, { data: {...params} }).then((res: any) => {
    if (res?.success) {
      const dataSource  = res?.data;
      return dataSource
      
    }
    return {};
  });


  // 追踪-链路追踪信息 getSearchTracing
  interface queryTraceParams{
    start:string;
    end:string;
    envCode:string;
    appID?:string;
    instanceIDs?:string[];
    pageIndex?:number;
    pageSize?:number;
    endpoint?:string
  }
export const getTrace = (params: queryTraceParams) =>  getRequest(APIS.getSearchTracing, { data: {...params,pageIndex:params?.pageIndex||1,pageSize:params?.pageSize||20} }).then((res: any) => {
  if (res?.success) {
    const dataSource  = res?.data;
    return dataSource
    
  }
  return {};
});
  