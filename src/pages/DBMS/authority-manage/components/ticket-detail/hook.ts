//getPrivInfoApi
import { useState } from 'react';
import { getRequest, postRequest, } from '@/utils/request';
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
        if (result?.success) {
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
