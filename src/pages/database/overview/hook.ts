import { useState } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';

//查询枚举信息

export const getEnumerateData = () => {
  return getRequest(`${APIS.getEnumerateData}`);
};

//查询概览信息
export function useQueryOverviewDashboards(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const getOverviewDashboards = async () => {
    setLoading(true);
    await getRequest(`${APIS.getOverviewDashboards}`)
      .then((result) => {
        if (result?.success) {
          setData(result?.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getOverviewDashboards];
}

//实例概览列表
export function useQueryOverviewInstances(): [boolean, any, (paramsObj: { instanceType: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const getOverviewInstances = async (paramsObj: { instanceType: number }) => {
    setLoading(true);
    await getRequest(`${APIS.getOverviewInstances}`, { data: { ...paramsObj } })
      .then((result) => {
        if (result?.success) {
          setData(result?.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getOverviewInstances];
}
