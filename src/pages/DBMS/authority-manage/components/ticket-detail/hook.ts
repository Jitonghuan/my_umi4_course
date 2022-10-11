//getPrivInfoApi
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';
export const useGetPrivInfo = ( id: number) =>
getRequest(APIS.getPrivInfoApi,{data:{id}}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data || {};
    return dataSource;
  }
  return {};
});
