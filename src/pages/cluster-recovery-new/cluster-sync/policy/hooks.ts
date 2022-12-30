
import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { getRequest,delRequest,postRequest,putRequest } from '@/utils/request';
import appConfig from '@/app.config';
import {message} from 'antd'
//getSyncStrategyListApi
//双集群配置列表

export const getSyncStrategyList = (envCode:string) =>
getRequest(APIS.getSyncStrategyListApi, {
   data: {envCode},
 });



//删除
export function useDeleteSyncStrategy(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteSyncStrategy = async (paramsObj: { id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteSyncStrategyApi}?id=${paramsObj.id}`)
      .then((result) => {
        if (result.success) {
          message.success('删除成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deleteSyncStrategy];
}

export function useGetNacosNamespaceList(): [
  boolean,
  any,
  (envCode:string) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
 
  const getNacosNamespaceList = async (envCode:string) => {
    setLoading(true);
    await getRequest(APIS.nacosNamespaceListApi,{data:{envCode}})
      .then((result) => {
        if (result.success) {
          let dataSource = result?.data||[];
        const options=  dataSource?.map((item:string)=>({
            label:item,
            value:item,
            key:item

          }))
          setData(options);
        
        } else {
          setData([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getNacosNamespaceList];
}

export function useGetDeploymentNameList(): [
  boolean,
  any,
  () => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
 
  const getDeploymentNameList = async () => {
    setLoading(true);
    await getRequest(APIS.deploymentNameListApi)
      .then((result) => {
        if (result?.success) {
          let dataSource = result?.data||[];
       const options=   dataSource?.map((item:string)=>({
            label:item,
            value:item,
            key:item

          }))
          setData(options);
        
        } else {
          setData([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getDeploymentNameList];
}

interface syncStrategyParams{
  envCode:string    //    环境Code		 true 
  configType:string    
  description:string    
  namespace:string    
  deploymentName:string
  specialConf:any;
  specialJvm:any

}
export const addSyncStrategy = (params:syncStrategyParams) =>
postRequest(APIS.addSyncStrategyApi, {
   data: params,
 });

 export const updateSyncStrategy = (params:syncStrategyParams) =>
putRequest(APIS.updateSyncStrategyApi, {
   data: params,
 });