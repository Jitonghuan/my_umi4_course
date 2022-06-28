import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
/** 查询release列表 */
export const queryReleaseList = (paramsObj?: {
  pageIndex?: number;
  pageSize?: number;
  releaseName?: string;
  namespace?: string;
  clusterName?: string;
}) => {
  return postRequest(APIS.getReleaseList, {
    data: {
      //   pageIndex: paramsObj?.pageIndex || 1,
      //   pageSize: paramsObj?.pageSize || 20,
      releaseName: paramsObj?.releaseName || '',
      namespace: paramsObj?.namespace || '',
      clusterName: paramsObj?.clusterName || '',
    },
  }).then((res: any) => {
    if (res?.success) {
      const dataSource = res.data || [];

      return dataSource;
    }
    return [];
  });
};

/** 查询release详情 */
export const queryReleaseInfo = (paramsObj: { releaseName?: string; namespace?: string; clusterName?: string }) => {
  return postRequest(APIS.getReleaseInfo, {
    data: {
      releaseName: paramsObj?.releaseName || '',
      namespace: paramsObj?.namespace || '',
      clusterName: paramsObj?.clusterName || '',
    },
  }).then((res: any) => {
    if (res?.success) {
      const dataSource = res.data || [];

      return dataSource;
    }
    return {};
  });
};

//获取集群
export function useGetClusterList(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const getClusterList = async () => {
    setLoading(true);
    await getRequest(`${APIS.getClusterList}`)
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

  return [loading, data, getClusterList];
}

//release更新
export function useUpgradeRelease(): [
  boolean,
  (paramsObj: { releaseName: string; namespace: string; valuesPath: string; clusterName: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const upgradeRelease = async (paramsObj: {
    releaseName: string;
    namespace: string;
    valuesPath: string;
    clusterName: string;
  }) => {
    setLoading(true);
    await postRequest(`${APIS.upgradeRelease}`, { data: paramsObj })
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

  return [loading, upgradeRelease];
}
//release删除
export function useDeleteRelease(): [
  boolean,
  (paramsObj: { releaseName: string; namespace: string; clusterName: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteRelease = async (paramsObj: { releaseName: string; namespace: string; clusterName: string }) => {
    setLoading(true);
    await postRequest(`${APIS.deleteRelease}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result?.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deleteRelease];
}
//release-values
export function useGetReleaseValues(): [
  boolean,
  any,
  (paramsObj: { releaseName: string; namespace: string; clusterName: string; revision: number }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const getReleaseValues = async (paramsObj: {
    releaseName: string;
    namespace: string;
    clusterName: string;
    revision: number;
  }) => {
    setLoading(true);
    await postRequest(`${APIS.getReleaseValues}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          setData(result?.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getReleaseValues];
}

//release-values
export const getReleaseValues = (paramsObj: {
  releaseName: string;
  namespace: string;
  clusterName: string;
  revision?: number;
}) => {
  return postRequest(APIS.getReleaseValues, {
    data: paramsObj,
  }).then((res: any) => {
    if (res?.success) {
      const dataSource = res.data || [];

      return dataSource;
    }
    return [];
  });
};
