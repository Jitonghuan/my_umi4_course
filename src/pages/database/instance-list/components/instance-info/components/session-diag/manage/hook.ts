
import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../../../../service';
import { message } from 'antd';
//snapshotApi
  //账号管理-账号列表
export function useGetSnapshot(): [boolean, any, (paramsObj: { instanceId: number }) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const getSnapshot = async (paramsObj: { instanceId: number }) => {
      setLoading(true);
      setData({});
      await getRequest(`${APIS.snapshotApi}`, { data: paramsObj })
        .then((result) => {
          if (result?.success) {
            let dataSource = result?.data;
            setData(dataSource || {});
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, data, getSnapshot];
  }

  export const sessionKill = async (paramsObj: {instanceId:number,sessionId:any[]}) => {
    return await postRequest(`${APIS.sessionKillApi}`, { data: paramsObj });
  };
  

  export interface AddSessionRateLimitItem{
    id?:number;
    instanceId:number;//                 实例ID              int               必填
    limitMode:string;  //            	限流模式           string           必填
    sqlType:string;  //                  sql类型             string               必填
    maxiConcurrency:number;   //     最大并大量        int               必填		
    limitTime	:number//		限流时间（分钟） int 		必填		
     sqlKeyWords:string//		限流sql关键字     string           
    SqlTemplate:string//             限流sql模板       string

  }


  export const addSessionRateLimit = async (paramsObj: AddSessionRateLimitItem) => {
    return await postRequest(`${APIS.addsessionRateLimitApi}`, { data: paramsObj });
  };

  export const updateRateLimiter = async (paramsObj: AddSessionRateLimitItem) => {
    return await postRequest(`${APIS.updateRateLimiter}`, { data: paramsObj });
  };
  export const getSqlTemplate = async (sql:string) => {
    return await postRequest(`${APIS.getSqlTemplate}`, { data: {sql} });
  };

  export function useGetSessionRateLimitList(): [boolean, any,any,any, (paramsObj: { instanceId: number,runStatus:number,startTime?:string,stopTime?:string,pageSize?:number,pageIndex?:number}) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
  
    const [endData,setEndData]= useState<any>([]);
  
    const [endPageInfo,setEndPageInfo]=useState<any>({
      pageIndex:1,
      pageSize:20,
      total:0
    })
    const getSessionRateLimitList = async (paramsObj: { instanceId: number,runStatus:number,startTime?:string,stopTime?:string,pageSize?:number,pageIndex?:number}) => {
      setLoading(true);
      setEndData([])
      await getRequest(`${APIS.sessionRateLimitListApi}`, { data: {...paramsObj,pageSize:paramsObj?.pageSize||20,pageIndex:paramsObj?.pageIndex||1} })
        .then((result) => {
          if (result?.success) {
            let dataSource = result?.data?.dataSource;
         
              setEndData(dataSource || []);
              setEndPageInfo(result?.data?.pageInfo)
          
            
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, endData,endPageInfo,setEndPageInfo, getSessionRateLimitList];
  }

  export const closeDownRateLimiter = async (id:number) => {
    return await putRequest(`${APIS.closeDownRateLimiter}?id=${id}`, { data: {id} });
  };
  export const getLockSession = async (params:{instanceId:number,
    startTime?:string, stopTime?:string}) => {
    return await getRequest(`${APIS.lockSession}`, { data: params});
  };

  export function useGetRunSessionList(): [boolean, any,any,any, (paramsObj: { instanceId: number,runStatus:number,pageSize?:number,pageIndex?:number}) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
   
    const [pageInfo,setPageInfo]=useState<any>({
      pageIndex:1,
      pageSize:20,
      total:0
    })
   
    const getSessionRateLimitList = async (paramsObj: { instanceId: number,runStatus:number,pageSize?:number,pageIndex?:number}) => {
      setLoading(true);
      setData([]);
      await getRequest(`${APIS.sessionRateLimitListApi}`, { data: {...paramsObj,pageSize:paramsObj?.pageSize||20,pageIndex:paramsObj?.pageIndex||1} })
        .then((result) => {
          if (result?.success) {
            let dataSource = result?.data?.dataSource;
            if(paramsObj?.runStatus===1){
              setData(dataSource || []);
              setPageInfo(result?.data?.pageInfo)
            }
           
          } 
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, data,pageInfo,setPageInfo,getSessionRateLimitList];
  }