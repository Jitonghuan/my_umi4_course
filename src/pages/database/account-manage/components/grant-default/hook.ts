
import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';
//getPrivsDetail
export const getPrivsDetail = async (paramsObj: {clusterId:number,user:string,host:string}) => {
    return await getRequest(`${APIS.getPrivsDetail}`, { data: paramsObj });
  };

//getTableColumnList
export const getTableColumnList = async (paramsObj: {clusterId:number,dbName?:string,tableName?:string}) => {
  return await getRequest(`${APIS.getTableColumnList}`, { data: paramsObj });
};
//modifyPrivs
export const modifyPrivs = async (paramsObj: {clusterId:number,oldPrivs?:any,  newPrivs?:any,id:number}) => {
  return await postRequest(`${APIS.modifyPrivs}`, { data: paramsObj });
};
export const previewGrantSql = async (paramsObj: {user:string,oldPrivs?:any,  newPrivs?:any,host:string}) => {
  return await postRequest(`${APIS.previewGrantSql}`, { data: paramsObj });
};