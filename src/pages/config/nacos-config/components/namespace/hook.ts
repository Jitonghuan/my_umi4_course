import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest,delRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';
//查询namespace列表
interface queryNamespaceItems{
    namespaceId:number;
    namespaceShowName:string;
    namespaceDesc:string;
    quota:string;
    configCount:number;
    type:number;//0：保留空间。2：创建的命名空间
  }
  export const getNacosNamespaces = (envCode:string ) =>
  getRequest(APIS.getNacosNamespacesApi,{data:{envCode}}).then((res: any) => {
    if (res?.success) {
      const dataSource = res?.data?.namespaces || [];
      return dataSource;
    }
  return [];
});
