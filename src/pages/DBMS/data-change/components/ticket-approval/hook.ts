
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';
export const useGetSqlInfo = ( id: number) =>
getRequest(APIS.getSqlInfoApi,{data:{id}}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data || {};
    return dataSource;
  }
  return {};
});

//auditApi
export function useAuditTicket(): [
    boolean,
    (paramsObj: { auditType: string; reason?: string;id:number}) => Promise<void>,
  ] {
    const [loading, setLoading] = useState<boolean>(false);
    const auditTicket = async (paramsObj: { auditType: string; reason?: string;id:number }) => {
      setLoading(true);
      await postRequest(APIS.auditApi, { data: paramsObj })
        .then((result) => {
          if (result.success) {
            message.success('审批成功！');
          } else {
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, auditTicket];
  }

  //runSqlApi
  export function useRunSql(): [
    boolean,
    (paramsObj: { runMode: number; runDate?: string;id:number}) => Promise<void>,
  ] {
    const [loading, setLoading] = useState<boolean>(false);
    const runSql = async (paramsObj: { runMode: number; runDate?: string;id:number }) => {
      setLoading(true);
      await postRequest(APIS.runSqlApi, { data: paramsObj })
        .then((result) => {
          if (result.success) {
            message.success('审批成功！');
          } else {
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, runSql];
  }