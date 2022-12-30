import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../../../service';
import { message } from 'antd';
export function useGetSlowLogList(): [boolean, any,any,any, (paramsObj: { instanceId: number,envCode:string,pageSize?:number,pageIndex?:number,database?:string,start:string,end:string}) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
   
    const [pageInfo,setPageInfo]=useState<any>({
      pageIndex:1,
      pageSize:30,
      total:0
    })
   
    const getSlowLogList = async (paramsObj: { instanceId: number,envCode:string,pageSize?:number,pageIndex?:number,database?:string,start:string,end:string}) => {
      setLoading(true);
      setData([]);
      await getRequest(`${APIS.getSlowLogList}`, { data: {...paramsObj,pageSize:paramsObj?.pageSize||30,pageIndex:paramsObj?.pageIndex||1} })
        .then((result) => {
          if (result?.success) {
            let dataSource = result?.data?.dataSource;
          
              setData(dataSource || []);
              setPageInfo(result?.data?.pageInfo)
           
           
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, data,pageInfo,setPageInfo,getSlowLogList];
  }

  export function useGetSlowLogDetail(): [boolean, any,any,any, (paramsObj: { instanceId: number,envCode:string,pageSize?:number,pageIndex?:number,database?:string,start:string,end:string}) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
   
    const [pageInfo,setPageInfo]=useState<any>({
      pageIndex:1,
      pageSize:30,
      total:0
    })
   
    const getSlowLogDetail = async (paramsObj: { instanceId: number,envCode:string,pageSize?:number,pageIndex?:number,database?:string,start:string,end:string}) => {
      setLoading(true);
      setData([]);
      await getRequest(`${APIS.getSlowLogDetail}`, { data: {...paramsObj,pageSize:paramsObj?.pageSize||30,pageIndex:paramsObj?.pageIndex||1} })
        .then((result) => {
          if (result?.success) {
            let dataSource = result?.data?.dataSource;
          
              setData(dataSource || []);
              setPageInfo(result?.data?.pageInfo)
           
           
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, data,pageInfo,setPageInfo,getSlowLogDetail];
  }

  export function useGetSlowLogConfig(): [boolean, any, (paramsObj: { instanceId: number,envCode:string }) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const getSlowLogConfig = async (paramsObj: { instanceId: number,envCode:string}) => {
      setLoading(true);
      setData({});
      await getRequest(`${APIS.getSlowLogConfig}`, { data: paramsObj })
        .then((result) => {
          if (result?.success) {
            let dataSource = result?.data;
           
            setData(dataSource);
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, data, getSlowLogConfig];
  }
  export const updateSlowLogConfig = (params:{
    instanceId: number,envCode:string,status:boolean
  }) => {
    return putRequest(`${APIS.updateSlowLogConfig}?instanceId=${params?.instanceId}&envCode=${params?.envCode}&status=${params?.status}`);
  };