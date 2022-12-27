
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
