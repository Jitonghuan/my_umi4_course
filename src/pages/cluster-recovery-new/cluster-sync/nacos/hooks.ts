import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { getRequest,postRequest } from '@/utils/request';
import appConfig from '@/app.config';
//Nacos配置比对
interface diffParams{
     envCode:string    //    环境Code		 true 
     type:string     //  比对类型    	 true  枚举：单配置同步: single  命名空间同步: namespace
     namespace:string     //  nacos 命名空间    true
     dataId:string      // 配置项Data ID      false

}
export const diffConfig = (params:diffParams) =>
getRequest(APIS.diffConfigApi, {
    data: params,
  });
//Nacos配置同步
interface diffParams{
    envCode:string    //    环境Code		 true 
    type:string     //  比对类型    	 true  枚举：单配置同步: single  命名空间同步: namespace
    namespace:string     //  nacos 命名空间    true
    dataId:string      // 配置项Data ID      false

}
export const syncConfig = (params:diffParams) =>
postRequest(APIS.syncConfigApi, {
   data: params,
 });


 export function useNacosNamespaceList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
 
  const queryNacosNamespaceList = async (envCode?:string) => {
    setLoading(true);
    await getRequest(APIS.getNacosNamespaceApi, { data:{envCode} })
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data || [];
          let option= dataSource?.map((ele:any)=>({
              label:ele,
              value:ele,
              key:ele
          }))
         
          setSource(option);
        
        }
       
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading,  source, queryNacosNamespaceList];
}
export function useNacosDataIdList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
 
  const queryNacosDataIdList = async (params:{envCode?:string,namespace?:string}) => {
    setLoading(true);
    await getRequest(APIS.getNacosNsDataIdApi, { data:params })
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data || [];
          let option= dataSource?.map((ele:any)=>({
              label:ele,
              value:ele,
              key:ele
          }))
         
          setSource(option);
        
        }
       
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading,  source, queryNacosDataIdList];
}


