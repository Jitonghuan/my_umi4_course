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
export function useDeleteTask(): [boolean, (paramsObj: { jobCode: string }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteTask = async (paramsObj: { jobCode: string }) => {
    setLoading(true);
    await delRequest(`${APIS.upgradeRelease}/${paramsObj.jobCode}`)
      .then((result) => {
        if (result.success) {
          message.success('删除成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deleteTask];
}
//release删除
export function useDeleteRelease(): [boolean, (paramsObj: { jobCode: string }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteRelease = async (paramsObj: { jobCode: string }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteRelease}/${paramsObj.jobCode}`)
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
