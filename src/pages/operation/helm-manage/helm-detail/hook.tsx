import { useState } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
/** 查询资源列表 */
export const queryReleaseInfo = (paramsObj: { releaseName: string; namespace: string; clusterName: string }) => {
  return getRequest(APIS.getReleaseInfo, {
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

/** release历史版本查询 */
export const getHistoryReleaseList = (paramsObj: { releaseName: string; namespace: string; clusterName: string }) => {
  return getRequest(APIS.getHistoryReleaseList, {
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

//release更新
export function useRollbackRelease(): [
  boolean,
  (paramsObj: { releaseName: string; namespace: string; revision: string; clusterName: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const rollbackRelease = async (paramsObj: {
    releaseName: string;
    namespace: string;
    revision: string;
    clusterName: string;
  }) => {
    setLoading(true);
    await postRequest(`${APIS.rollbackRelease}`, { data: paramsObj })
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

  return [loading, rollbackRelease];
}
