import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

//获取chart名称
export function useGetClusterListPodNamespace(): [
  boolean,
  any,
  (paramsObj: { clusterName: string; repository?: string; chartName?: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const getPodNamespace = async () => {
    setLoading(true);
    await getRequest(`${APIS.getChartList}`)
      .then((result) => {
        if (result?.success) {
          let dataSource = result?.data;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({
              label: item?.clusterName,
              value: item?.clusterName,
            });
          });

          setData(dataArry);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getPodNamespace];
}

export const queryPodNamespaceData = (params: { clusterId: string }) =>
  getRequest(APIS.getPodNamespace, { data: params }).then((res: any) => {
    if (res?.success) {
      const result: any = [];
      let dataSource = res.data;
      dataSource?.map((ele: any) => {
        result.push({
          label: ele.namespace,
          value: ele.namespace,
        });
      }, []);

      return result;
    }
    return [];
  });
