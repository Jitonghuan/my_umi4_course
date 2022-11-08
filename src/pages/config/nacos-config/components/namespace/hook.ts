import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest,delRequest,putRequest } from '@/utils/request';
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
export const getSingleNacosNamespace = (envCode:string,namespaceId:number ) =>
getRequest(APIS.getSingleNacosNamespaceApi,{data:{envCode,namespaceId}}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data?.namespace || {};
    return dataSource;
  }
return {};
});
export interface createNamespaceItems{
  envCode:string,
  namespaceId:string,
  namespaceShowName:string,
  namespaceDesc?:string


}
//新增
export function useCreateNamespace(): [
  boolean,
  (paramsObj:createNamespaceItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createNamespace = async (paramsObj:createNamespaceItems) => {
    setLoading(true);
    await postRequest(APIS.createNamespaceApi, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success('新增成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, createNamespace];
}

//修改
export function useUpdateNamespace(): [
  boolean,
  (paramsObj:createNamespaceItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateNamespace = async (paramsObj:createNamespaceItems) => {
    setLoading(true);
    await postRequest(APIS.updateNamespaceApi, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
          message.success('修改成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateNamespace];
}

//删除
export function useDeleteNamespace(): [boolean, (paramsObj: { namespaceId: number,envCode:string }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteNamespace = async (paramsObj: { namespaceId: number,envCode:string }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteNamespaceApi}`,{data:paramsObj})
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

  return [loading, deleteNamespace];
}
