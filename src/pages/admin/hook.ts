import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';

/**
 * POD明细列表
 */

export const queryPodUseData = (params: { type?: string; pageIdex?: number; pageSize?: number }) =>
  getRequest(APIS.getInfoList, { data: params }).then((res: any) => {
    if (res?.success) {
      let podResourceData: any = [];
      podResourceData = res.dataSource;

      return podResourceData;
    }
    return [];
  });
