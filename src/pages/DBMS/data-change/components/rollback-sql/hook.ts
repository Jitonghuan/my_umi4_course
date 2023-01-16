import { useState } from 'react';
import { getRequest,} from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';


export const useGetRollbackSQL = ( id: number) =>
getRequest(APIS.rollbackSQLApi,{data:{id}}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data?.dataSource || [];
    return dataSource;
  }
  return [];
});
//exportRollbackSQLApi