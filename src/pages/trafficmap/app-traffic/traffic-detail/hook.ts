import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';


  /** 查询环境列表 */
  
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

/** 查询应用列表 */
export const queryAppList = (params:{
  start:string;
  end:string;
  envCode:string;
}) =>
  getRequest(APIS.getTrafficList, {
    data: params,
  }).then((res: any) => {
    if (res?.success) {
      const  dataSource = res?.data || [];
      return dataSource.map((app: any) => {
        return {
          ...app,
          value: app.appCode,
          label: app.appCode,
        };
      });
    }
    return [];
  });

interface queryInstanceParams{
    start:string;
    end:string;
    envCode:string;
    appID:string
}

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

// export const queryInstanceList = (params: queryInstanceParams) =>
// getRequest(APIS.queryInstanceListApi, { data: {...params, },hideToast: true, }).then((res: any) => {
//   if (res?.success) {
//     const data = res?.data?.map((item: any) => ({ ...item, value: item.key }));
//     return data
    
//   }
 
//   return [];
// });
interface queryCountOverviewParams{
  start:string;
  end:string;
  envCode:string;
  appId:string;
 
}
//getCountOverview
export const getCountOverview = (params: queryCountOverviewParams) =>
getRequest(APIS.getCountOverview, { data: {...params} }).then((res: any) => {
  if (res?.success) {
    const dataSource  = res?.data;
    return dataSource
    
  }
  return [];
});
