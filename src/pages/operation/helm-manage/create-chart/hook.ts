import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

//获取chart名称
export function useGetChartName(): [
  boolean,
  any,
  (paramsObj: { clusterName: string; repository?: string; chartName?: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const getChartList = async (paramsObj: { clusterName: string; repository?: string; chartName?: string }) => {
    setLoading(true);
    await getRequest(`${APIS.getChartList}`, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
          let dataSource = result?.data;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({
              label: item?.name,
              value: item?.name,
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

  return [loading, data, getChartList];
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

export const queryChartVersions = (params: { chartName: string; clusterName: string }) =>
  getRequest(APIS.chartVersions, { data: params }).then((res: any) => {
    if (res?.success) {
      const result: any = [];
      let dataSource = res.data;
      dataSource?.map((ele: any) => {
        result.push({
          label: ele.version,
          value: ele.version,
        });
      }, []);

      return result;
    }
    return [];
  });
