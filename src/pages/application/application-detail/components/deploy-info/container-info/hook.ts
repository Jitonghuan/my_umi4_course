import { useState } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../deployInfo-content/service';

//查看deployment的事件
export function useListDeploymentList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);

  const getDeploymentEventList = async (paramObj: { appCode: string; envCode: string }) => {
    setLoading(true);
    await getRequest(APIS.getListDeploymentEvent, { data: paramObj })
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data || [];
          setSource(dataSource);
        }
        if (!result?.success) {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, source, setSource, getDeploymentEventList];
}

/** 查看deployment的事件 */
export const getDeploymentEventListMethods = (paramObj: { appCode: any; envCode: string }) =>
  getRequest(APIS.getListDeploymentEvent, { data: paramObj }).then((res: any) => {
    if (res?.success) {
      let dataSource: any = [];
      return (dataSource = res.data || []) || [];
    }
    return [];
  });

/** 查看容器的事件 */
export const queryContainerMethods = (paramsObj: { appCode: string; envCode: string; instName: string }) =>
  getRequest(APIS.listContainer, { data: paramsObj }).then((res: any) => {
    if (res?.success) {
      let dataSource: any = [];
      return (dataSource = res.data || []) || [];
    }
    return [];
  });

/** 查看Pod的事件 */
export const getListPodEventMethods = (paramObj: { instName: string; envCode: string }) =>
  getRequest(APIS.getListPodEvent, { data: paramObj }).then((res: any) => {
    if (res?.success) {
      let dataSource: any = [];
      return (dataSource = res.data || []) || [];
    }
    return [];
  });

export function useListContainer(): [
  (paramsObj: { appCode: string; envCode: string; instName: string }) => Promise<void>,
  any,
  boolean,
] {
  const [queryContainerData, setQueryContainerData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const queryContainer = async (paramsObj: { appCode: string; envCode: string; instName: string }) => {
    setLoading(true);
    getRequest(APIS.listContainer, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          let data = result.data;
          setQueryContainerData(data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return [queryContainer, queryContainerData, loading];
}

//查看pod的事件
export function useGetPodEventList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);

  const getPodEventList = async (paramObj: { instName: string; envCode: string }) => {
    setLoading(true);
    await getRequest(APIS.getListPodEvent, { data: paramObj })
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data || [];
          setSource(dataSource);
        }
        if (!result?.success) {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, source, setSource, getPodEventList];
}
