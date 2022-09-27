import { useState,useCallback } from 'react';
import * as APIS from '../../../../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';
type AnyObject = Record<string, any>;

//获取queryFrontbucketList
export function useFrontbucketList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    const queryFrontbucketList =useCallback( async () => {
      setLoading(true);
      await getRequest(APIS.queryFrontbucketList)
        .then((res) => {
          if (res?.success) {
            let dataSource = res.data || [];
            let options: any = [];
            dataSource?.map((item: any, index: number) => {
              options.push({
                label: item,
                value: item,
              });
            });
            setDataSource(options);
          } else {
            setDataSource([]);
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },[]);
  
    return [loading, dataSource, queryFrontbucketList];
  }
  
  //获取queryBelongList
  export function useBelongList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    const queryBelongList = useCallback(async () => {
      setLoading(true);
      await getRequest(APIS.queryBelongList)
        .then((res) => {
          if (res?.success) {
            let dataSource = res.data || [];
            let options: any = [];
            dataSource?.map((item: any, index: number) => {
              options.push({
                label: item,
                value: item,
               
              });
            });
            setDataSource(options);
          } else {
            setDataSource([]);
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },[]);
  
    return [loading, dataSource,queryBelongList];
  }
  

  

  //queryNamespaceList
  export function useNamespaceList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    const queryNamespaceList = useCallback(async (componentName:string) => {
      setLoading(true);
      await getRequest(APIS.queryNamespaceList,{data:{componentName}})
        .then((res) => {
          if (res?.success) {
            let dataSource = res.data || [];
            let options: any = [];
            dataSource?.map((item: any, index: number) => {
              options.push({
                label: item,
                value: item,
               
              });
            });
            setDataSource(options);
          } else {
            setDataSource([]);
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },[]);
  
    return [loading, dataSource,queryNamespaceList];
  }
  
//bulkdeleteApi
export function useBulkdelete():[boolean, (componentIds: any) => Promise<void>]{
  const [loading, setLoading] = useState<boolean>(false);
  const bulkdelete = useCallback(async (componentIds:any) => {
    setLoading(true);
    await delRequest(APIS.bulkdeleteApi,{data:{componentIds}})
      .then((res) => {
        if (res?.success) {
         message.success(res?.data)
        } 
      })
      .finally(() => {
        setLoading(false);
      });
  },[]);

  return [loading,bulkdelete];
}
//bulkaddApi
export function useBulkAdd() {
  const [loading, setLoading] = useState<boolean>(false);
  const bulkadd = useCallback(async (versionId:number,componentName:string) => {
    setLoading(true);
    await postRequest(APIS.bulkaddApi,{data:{versionId,componentName}})
      .then((res) => {
        if (res?.success) {
         message.success(res?.data)
        } 
      })
      .finally(() => {
        setLoading(false);
      });
  },[]);

  return [loading,bulkadd];
}