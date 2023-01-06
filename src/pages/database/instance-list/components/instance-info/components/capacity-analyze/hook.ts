
import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../../../service';
import { message } from 'antd';

export function useGetCapacityStatistic(): [boolean, any, (paramsObj: { instanceId: number,envCode:string }) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const getCapacityStatistic = async (paramsObj: { instanceId: number,envCode:string}) => {
      setLoading(true);
      setData({});
      await getRequest(`${APIS.getCapacityStatistic}`, { data: paramsObj })
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
  
    return [loading, data, getCapacityStatistic];
  }
  export function useGetAbnormalTableList(): [boolean, any,any,any, (paramsObj: { instanceId: number,envCode:string,pageSize?:number,pageIndex?:number}) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
   
    const [pageInfo,setPageInfo]=useState<any>({
      pageIndex:1,
      pageSize:20,
      total:0
    })
   
    const getAbnormalTableList = async (paramsObj: { instanceId: number,envCode:string,pageSize?:number,pageIndex?:number}) => {
      setLoading(true);
      setData([]);
      await getRequest(`${APIS.getAbnormalTableList}`, { data: {...paramsObj,pageSize:paramsObj?.pageSize||20,pageIndex:paramsObj?.pageIndex||1} })
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
  
    return [loading, data,pageInfo,setPageInfo,getAbnormalTableList];
  }
  export function useGetTableSpaceList(): [boolean, any,any,any, (paramsObj: { instanceId: number,envCode:string,pageSize?:number,pageIndex?:number,keyWord?:string}) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
   
    const [pageInfo,setPageInfo]=useState<any>({
      pageIndex:1,
      pageSize:20,
      total:0
    })
   
    const getTableSpaceList = async (paramsObj: { instanceId: number,envCode:string,pageSize?:number,pageIndex?:number,keyWord?:string}) => {
      setLoading(true);
      setData([]);
      await getRequest(`${APIS.getTableSpaceList}`, { data: {...paramsObj,pageSize:paramsObj?.pageSize||20,pageIndex:paramsObj?.pageIndex||1} })
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
  
    return [loading, data,pageInfo,setPageInfo,getTableSpaceList];
  }