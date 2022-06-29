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
              label: item?.chartName,
              value: item?.chartName,
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

export const queryChartVersions = (params: { chartName?: string; clusterName: string; repository?: string }) =>
  getRequest(APIS.getRepositoryVersions, { data: params }).then((res: any) => {
    if (res?.success) {
      const result: any = [];
      let dataSource = res.data;
      dataSource?.map((ele: any) => {
        result.push({
          label: ele.chartVersion,
          value: ele.chartVersion,
        });
      }, []);

      return result;
    }
    return [];
  });

export const queryChartValues = (params: {
  chartName: string;
  clusterName: string;
  repository: string;
  chartVersion: string;
}) =>
  getRequest(APIS.chartValues, { data: params }).then((res: any) => {
    if (res?.success) {
      const result: any = [];
      let dataSource = res.data;

      return dataSource;
    }
    return [];
  });

export const queryChartList = (paramsObj: { clusterName: string; repository?: string; chartName?: string }) =>
  getRequest(APIS.getChartList, { data: paramsObj }).then((res: any) => {
    if (res?.success) {
      const result: any = [];
      let dataSource = res.data;

      return dataSource;
    }
    return [];
  });
export const queryChartReadme = (paramsObj: {
  clusterName: string;
  repository?: string;
  chartName?: string;
  chartVersion: string;
}) =>
  getRequest(APIS.chartReadme, { data: paramsObj }).then((res: any) => {
    if (res?.success) {
      const result: any = [];
      let dataSource = res.data;

      return dataSource;
    }
    return [];
  });
