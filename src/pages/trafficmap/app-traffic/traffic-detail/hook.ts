import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';


/** 查询应用列表 */
export const queryAppList = () =>
  getRequest(APIS.queryAppListApi, {
    data: {
      pageIndex: 1,
      pageSize: 1000,
    },
  }).then((res: any) => {
    if (res?.success) {
      const { dataSource = [] } = res?.data || {};
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

  /** 根据应用查询环境列表 */
export const queryEnvList = (params: { appCode: string, }) =>
getRequest(APIS.queryEnvListApi, { data: {...params,pageSize:-1} }).then((res: any) => {
  if (res?.success) {
    const { dataSource = [] } = res?.data;
    let envObj: any = {};
    return (
      dataSource?.map((env: any) => {
        if (env.envName.search('前端') === -1) {
          envObj = {
            ...env,
            value: env.envCode,
            label: env.envCode,
          };
        }

        return envObj;
       
      }) || []
    );
  }
  return [];
});
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
