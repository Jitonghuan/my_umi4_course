import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';
interface createItems {
    ruleSetName?: string;
    ruleSetRemark?: string;
    engineType?: string;
    designFlow?: string;

}
//新建安全规则
export const createRuleSet = (params: createItems) =>
  postRequest(APIS.createRuleSetApi, {
    data: params,
  });

  //更新安全规则
  interface updateItems {
    id:number;
    ruleSetName?: string;
    ruleSetRemark?: string;
    designFlow?: string;

}

export const updateRuleSet = (params: updateItems) =>
  postRequest(APIS.updateRuleSetApi, {
    data: params,
  });

  //deleteRuleSetApi
  export const deleteRuleSet = (id: number) =>
  delRequest(`${APIS.deleteRuleSetApi}?id=${id}`);