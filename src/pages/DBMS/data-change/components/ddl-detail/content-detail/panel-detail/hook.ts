
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../../../../../service';
import { message } from 'antd';
export const useGetSqlInfo = ( id: number) =>
getRequest(APIS.getSqlInfoApi,{data:{id}}).then((res: any) => {
  if (res?.success) {
    const dataSource = res?.data || {};
    return dataSource;
  }
  return {};
});
interface nextEnvItems{
  parentWfId:number;
  envType:string;
  sqlContent?: string;
  dbCode?: string;
  envCode?: string;
  instanceId?: number;
  runStartTime?: string;
  runEndTime?: string;
  allowTiming: boolean;
}

export const createNextDDL = (params: nextEnvItems) =>
  postRequest(APIS.createNextDDLApi, {
    data: params,
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
    (paramsObj: { runMode: string; runDate?: string;id:number}) => Promise<void>,
  ] {
    const [loading, setLoading] = useState<boolean>(false);
    const runSql = async (paramsObj: { runMode: string; runDate?: string;id:number }) => {
      setLoading(true);
      await postRequest(APIS.runSqlApi, { data: paramsObj })
        .then((result) => {
          if (result?.success) {
            message.success('执行成功！');
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
  export function useworkflowLog(): [
    boolean,
    any,
    (id:number) => Promise<void>,
  ] {
    const [loading, setLoading] = useState<boolean>(false);
    const [data,setData]=useState<any>([])
    const getWorkflowLog = async (id:number ) => {
      setLoading(true);
      await getRequest(`${APIS.workflowLogApi}?id=${id}`)
        .then((result) => {
          if (result?.success) {
            let data=result?.data?.workflowLogs||[]
            setData(data)
           
          } else {
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading,data, getWorkflowLog];
  }

 