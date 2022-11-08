import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest,delRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';

interface queryConfigListItems{
  namespaceId:number;
  envCode:string;
  dataId?:string;
  groupId?:string;
  pageIndex?:number;
  pageSize?:number;//0：保留空间。2：创建的命名空间
}
export const getConfigList = (params:queryConfigListItems ) =>
getRequest(APIS.getConfigListApi,{data:{...params,pageIndex:params?.pageIndex||1,pageSize:params?.pageSize||20}}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data || {};
    return dataSource;
  }
return {};
});


//删除Namespace
export function useDeleteNamespace(): [boolean, (paramsObj: {envCode:string, namespaceId: string,nacosIds:any }) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const deleteNamespace = async (paramsObj: { envCode:string, namespaceId: string,nacosIds:any }) => {
      setLoading(true);
      await delRequest(APIS.deleteNacosConfigApi,{data:paramsObj})
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


  //查询configVersion 列表
  export const getConfigDetails = (versionId:number ) =>
   getRequest(APIS.getNacosConfigApi,{data:{versionId}}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data || {};
   
    return dataSource;
  }
return {};
});
  interface configVersionItems{
    namespaceId:string;
    envCode:string;
    dataId?:string;
    groupId?:string;
    
  }
  //查询configVersion 列表
  export const getConfigVersions = (params:configVersionItems ) =>
   getRequest(APIS.getConfigVersionsApi,{data:params}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data?.versions || [];
    let versionOptions:any=[]
    dataSource?.map((item:any)=>{
      versionOptions.push({
        label:item?.version,
        value:item?.id,
        isLatest:item?.isLatest
      })

    })
    return versionOptions;
  }
return [];
});
export interface CreateConfigItems {

  envCode: string;
  namespaceId: string;
  dataId: string;
  groupId: string;
  content:string;
  formatType:string;
  desc:string;

}
//新增配置
export function useCreateNacosConfig(): [boolean, (paramsObj: CreateConfigItems) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const createNacosConfig = async (paramsObj: CreateConfigItems) => {
    setLoading(true);
    await postRequest(`${APIS.createNacosConfigApi}`, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
          message.success('新增配置成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, createNacosConfig];
}
//更新
export function useUpdateNacosConfig(): [boolean, (paramsObj: CreateConfigItems) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateNacosConfig = async (paramsObj: CreateConfigItems) => {
    setLoading(true);
    await postRequest(`${APIS.updateNacosConfigApi}`, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
          message.success('更新配置成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateNacosConfig];
}
//回滚
export function useRollbackNacosConfig(): [boolean, (versionId: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const rollbackNacosConfig = async (versionId: number) => {
    setLoading(true);
    await postRequest(`${APIS.rollbackNacosConfigApi}`, { data: {versionId} })
      .then((result) => {
        if (result?.success) {
          message.success('回滚配置成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, rollbackNacosConfig];
}
