import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

//新建账号
export function useAddInstance(): [
  boolean,
  (paramsObj: {
    name: string;
    instanceType: number;
    instanceVersion: string;
    clusterId: number;
    clusterRole: number;
    instanceHost: string;
    instancePort: string;
    manageUser: string;
    managePassword: string;
    description: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addInstance = async (paramsObj: {
    name: string;
    instanceType: number;
    instanceVersion: string;
    clusterId: number;
    clusterRole: number;
    instanceHost: string;
    instancePort: string;
    manageUser: string;
    managePassword: string;
    description: string;
  }) => {
    setLoading(true);
    await postRequest(`${APIS.addInstance}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, addInstance];
}
//updateInstance
export function useUpdateInstance(): [
  boolean,
  (paramsObj: {
    id: number;
    name: string;
    instanceType: number;
    instanceVersion: string;
    clusterId: number;
    clusterRole: number;
    instanceHost: string;
    instancePort: string;
    manageUser: string;
    managePassword: string;
    description: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateInstance = async (paramsObj: {
    name: string;
    id: number;
    instanceType: number;
    instanceVersion: string;
    clusterId: number;
    clusterRole: number;
    instanceHost: string;
    instancePort: string;
    manageUser: string;
    managePassword: string;
    description: string;
  }) => {
    setLoading(true);
    await putRequest(`${APIS.updateInstance}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateInstance];
}

//集群列表
export function useGetClusterList(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const getClusterList = async () => {
    setLoading(true);
    await getRequest(`${APIS.getClusterList}`, { data: { pageIndex: -1, pageSize: -1 } })
      .then((result) => {
        if (result.success) {
          let dataSource = result?.data?.dataSource;
          const dataArry = dataSource?.map((item: any) => ({
            label: item?.name,
            value: item?.id,
          }));
          setData(dataArry || []);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getClusterList];
}

//delete
export function useDeleteInstance(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteInstance = async (paramsObj: { id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteInstance}?id=${paramsObj?.id}`)
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deleteInstance];
}
//同步
export function useSyncMetaData(): [boolean, (paramsObj: { clusterId: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const syncMetaData = async (paramsObj: { clusterId: number }) => {
    setLoading(true);
    await getRequest(`${APIS.syncMetaData}?clusterId=${paramsObj?.clusterId}`)
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, syncMetaData];
}
//详情
export function useGetInstanceDetail(): [boolean, any, any, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({});
  const [topoData, setTopoData] = useState<any>([]);
  const getInstanceDetail = async (paramsObj: { id: number }) => {
    setLoading(true);
    await getRequest(`${APIS.getInstanceDetail}`, { data: { id: paramsObj?.id } })
      .then((result) => {
        if (result.success) {
          let dataSource = result?.data;
          setData(dataSource?.instance || {});
          setTopoData(dataSource?.topology || []);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, topoData, getInstanceDetail];
}

//新建集群
export function useCreateAccount(): [
  boolean,
  (paramsObj: {
    clusterId: number;
    user: string;
    host: string;
    password: string;
    description: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createAccount = async (paramsObj: {
    clusterId: number;
    user: string;
    host: string;
    password: string;
    description: string;
  }) => {
    setLoading(true);
    await postRequest(`${APIS.addCluster}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, createAccount];
}
