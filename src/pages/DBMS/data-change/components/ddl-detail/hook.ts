
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';
export const useGetDdlDesignFlow = ( id: number,envType?:string) =>
getRequest(APIS.getddlDesignFlowApi,{data:{id,envType}}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data || {};
    return dataSource;
  }
  return {};
});

//rollbackSQLApi
export const useGetRollbackSQL= ( id: number) =>
getRequest(APIS.rollbackSQLApi,{data:{id}}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data?.dataSource || [];
    return dataSource;
  }
  return [];
});

//getSqlDdlInfoApi
export const useGetSqlDdlInfo = ( params:{parentWfId: number,envType?:string}) =>
getRequest(APIS.getSqlDdlInfoApi,{data:params}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data?.dataSource || [];
    return dataSource;
  }
  return {};
});
