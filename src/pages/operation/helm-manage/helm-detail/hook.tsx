import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
/** 查询资源列表 */
export const queryReleaseInfo = (paramsObj: { releaseName: string; namespace: string; clusterName: string }) => {
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

/** release历史版本查询 */
export const getHistoryReleaseList = (paramsObj: { releaseName: string; namespace: string; clusterName: string }) => {
  return postRequest(APIS.getHistoryReleaseList, {
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
