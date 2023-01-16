import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
import { CreateClusterItem, UpdateClusterItem } from '../interfaces';
//列表查询
export function useClusterList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });

  const getClusterList =  (paramObj: {
    name?: string;
    clusterType?: number;
    envCode?: string;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    setLoading(true);
     getRequest(APIS.getClusterList, { data: paramObj }).then((result) => {
        if (result?.success) {
          debugger
          const dataSource = result?.data?.dataSource || [];
          const pageInfo = result?.data?.pageInfo||{};
          setSource(dataSource);
          setPageInfo(pageInfo);
        }
      }).finally(() => {
        setLoading(false);
      });
  };

  return [loading, pageInfo, source, getClusterList];
}

export const addCluster = async (paramsObj: CreateClusterItem) => {
  return await postRequest(`${APIS.addCluster}`, { data: paramsObj });
};

export const updateCluster = async (paramsObj: UpdateClusterItem) => {
  return await putRequest(`${APIS.updateCluster}`, { data: paramsObj });
};
//新建集群
export function useAddCluster(): [boolean, (paramsObj: CreateClusterItem) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const addCluster = async (paramsObj: CreateClusterItem) => {
    setLoading(true);
    await postRequest(`${APIS.addCluster}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } 
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, addCluster];
}

//updateInstance
export function useUpdateCluster(): [boolean, (paramsObj: UpdateClusterItem) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateCluster = async (paramsObj: UpdateClusterItem) => {
    setLoading(true);
    await putRequest(`${APIS.updateCluster}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
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
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, envDataSource, queryEnvData];
}
