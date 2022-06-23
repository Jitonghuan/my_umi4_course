import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';
/** 查询列表 */
export const queryRuleList = (paramObj: {
  ruleName?: string;
  envCode?: string;
  checkLevel?: string;
  pageIndex?: string;
  pageSize?: string;
}) => {
  return getRequest(APIS.getRuleListApi, {
    data: {
      ruleName: paramObj?.ruleName,
      envCode: paramObj?.envCode,
      checkLevel: paramObj?.checkLevel,
      pageIndex: paramObj?.pageIndex || 1,
      pageSize: paramObj?.pageSize || 20,
    },
  }).then((res: any) => {
    if (res?.success) {
      const data = res.data || [];
      return data;
    }
    return [];
  });
};

/* 白名单 */
