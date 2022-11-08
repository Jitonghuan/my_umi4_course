import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest,delRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
//查询nacos环境列表
export const getNacosEnvs = ( ) =>
  getRequest(APIS.getNacosEnvsApi).then((res: any) => {
    if (res?.success) {
      const dataSource = res?.data?.envs || [];
      let arry:any=[]
      dataSource?.map((ele:any)=>{
        arry.push({
            label:ele?.envName,
            value:ele?.envCode
        }) 
      })
      return arry;
    }
  return [];
});