
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';
interface querySqlItems {
  sqlContent?: string;
  dbCode?: string;
  tableCode?: string;
  title?: string;
  // sqlWfType?:string;
  envCode?: string;
  instanceId?: number;
  runStartTime?: string;
  runEndTime?: string;
  allowTiming: boolean;


}
//createSqlApi
export const createSql = (params: querySqlItems) =>
  postRequest(APIS.createSqlApi, {
    data: params,
  });

interface checkSqlItems {
  sqlContent?: string;
  dbCode?: string;

  instanceId?: number;



}
//checkSqlApi
export const checkSql = (params: checkSqlItems) =>
  postRequest(APIS.checkSqlApi, {
    data: params,
  });

