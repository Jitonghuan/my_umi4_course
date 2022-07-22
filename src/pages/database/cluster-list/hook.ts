import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
//列表查询
export function useClusterList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });

  const getClusterList = async (paramObj: {
    name?: string;
    clusterType?: number;
    envCode?: string;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    setLoading(true);
    await getRequest(APIS.getClusterList, { data: paramObj })
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data.dataSource || [];
          const pageInfo = result.data.pageInfo;
          setSource(dataSource);
          setPageInfo(pageInfo);
        }
        if (!result?.success) {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, pageInfo, source, getClusterList];
}
//新建账号
export function useAddCluster(): [
  boolean,
  (paramsObj: {
    name: string;
    envCode: string;
    clusterType: number;
    slaveVipHost: string;
    slaveVipPort: string;
    masterVipHost: string;
    masterVipPort: string;
    description: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addCluster = async (paramsObj: {
    name: string;
    envCode: string;
    clusterType: number;
    slaveVipHost: string;
    slaveVipPort: string;
    masterVipHost: string;
    masterVipPort: string;
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

  return [loading, addCluster];
}

//updateInstance
export function useUpdateCluster(): [
  boolean,
  (paramsObj: {
    id: number;
    name: string;
    envCode: string;
    clusterType: number;
    slaveVipHost: string;
    slaveVipPort: string;
    masterVipHost: string;
    masterVipPort: string;
    description: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateCluster = async (paramsObj: {
    id: number;
    name: string;
    envCode: string;
    clusterType: number;
    slaveVipHost: string;
    slaveVipPort: string;
    masterVipHost: string;
    masterVipPort: string;
    description: string;
  }) => {
    setLoading(true);
    await putRequest(`${APIS.updateCluster}`, { data: paramsObj })
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

  return [loading, updateCluster];
}

//delete
export function useDeleteCluster(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteCluster = async (paramsObj: { id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteCluster}?id=${paramsObj?.id}`)
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

  return [loading, deleteCluster];
}

// 查询应用环境数据
export function useQueryEnvList() {
  const [loading, setLoading] = useState(false);
  const [envDataSource, setEnvDataSource] = useState<any>([]);
  const queryEnvData = () => {
    setLoading(true);
    getRequest(APIS.envList, { data: { pageIndex: -1, pageSize: -1 } })
      .then((result) => {
        if (result?.success) {
          let dataSource = result?.data?.dataSource;
          const options = dataSource?.map((item: any) => ({
            label: item.envCode,
            value: item.envCode,
            key: item.envCode,
          }));
          setEnvDataSource(options);
        } else {
          return [];
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, envDataSource, queryEnvData];
}
