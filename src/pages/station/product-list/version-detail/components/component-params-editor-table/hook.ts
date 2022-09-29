import { useState,useCallback } from 'react';
import * as APIS from '../../../../service';
import { getRequest, postRequest, delRequest } from '@/utils/request';
type AnyObject = Record<string, any>;

  //queryBasecomponentList
  export function useBasecomponentList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    const queryBasecomponentList = useCallback(async () => {
      setLoading(true);
      await getRequest(APIS.queryBasecomponentList)
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
  
    return [loading, dataSource,queryBasecomponentList];
  }

  //获取queryReleaseList
  export function useReleaseList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any>([]);
    const queryReleaseList = useCallback(async (componentName:string) => {
      setLoading(true);
      await getRequest(APIS.queryReleaseList,{data:{componentName}})
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
  
    return [loading, dataSource,queryReleaseList];
  }
  