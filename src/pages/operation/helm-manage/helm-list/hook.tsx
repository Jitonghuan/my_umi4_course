import { useState } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
/** 查询release列表 */
export const queryReleaseList = (paramsObj?: {
  releaseName?: string;
  namespace?: string;
  clusterName?: string;
  pageSize?: 20;
  pageIndex?: 1;
}) => {
  return getRequest(APIS.getReleaseList, {
    data: {
      releaseName: paramsObj?.releaseName || '',
      namespace: paramsObj?.namespace || '',
      clusterName: paramsObj?.clusterName || '',
      pageIndex: paramsObj?.pageIndex || 1,
      pageSize: paramsObj?.pageSize || 20,
    },
  }).then((res: any) => {
    if (res?.success) {
      const dataSource = res.data?.releaseLists || [];
      const total = res.data?.total || 0;

      return [dataSource, total];
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
              clusterId: item?.id,
              key: item?.id,
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

/** 查询release列表 */
export const getClusterList = () => {
  return getRequest(APIS.getClusterList).then((res: any) => {
    if (res?.success) {
      let dataSource = res?.data;
      let dataArry: any = [];
      dataSource?.map((item: any) => {
        dataArry.push({
          label: item?.clusterName,
          value: item?.clusterName,
          clusterId: item?.id,
          key: item?.id,
        });
      });

      return dataArry;
    }
    return [];
  });
};

/** 查询chart版本 */
export const queryChartVersions = (paramsObj?: { chartName: string; clusterName?: string }) => {
  return getRequest(APIS.chartVersions, {
    data: paramsObj,
  }).then((res: any) => {
    if (res?.success) {
      const dataSource = res.data || [];
      let dataArry: any = [];
      dataSource?.map((item: any) => {
        dataArry.push({
          label: item?.chartLink,
          value: item?.chartLink,
        });
      });

      return dataArry;
    }
    return [];
  });
};

//release更新
export function useUpgradeRelease(): [
  boolean,
  (paramsObj: {
    releaseName: string;
    namespace: string;
    values: string;
    clusterName: string;
    chartLink: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const upgradeRelease = async (paramsObj: {
    releaseName: string;
    namespace: string;
    values: string;
    clusterName: string;
    chartLink: string;
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
    await getRequest(`${APIS.getReleaseValues}`, { data: paramsObj })
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
  return getRequest(APIS.getReleaseValues, {
    data: paramsObj,
  }).then((res: any) => {
    if (res?.success) {
      const dataSource = res.data || [];

      return dataSource;
    }
    return [];
  });
};

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
