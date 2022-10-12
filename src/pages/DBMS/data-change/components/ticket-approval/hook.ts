
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
    (paramsObj: { auditType: string; remark?: string;}) => Promise<void>,
  ] {
    const [loading, setLoading] = useState<boolean>(false);
    const auditTicket = async (paramsObj: { auditType: string; remark?: string }) => {
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