import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest,delRequest } from '@/utils/request';
import * as APIS from '../../../service';
import { message } from 'antd';






//删除用户角色
export function useDeleteNamespace(): [boolean, (paramsObj: {envCode:string, namespaceId: number }) => Promise<void>] {
    const [loading, setLoading] = useState<boolean>(false);
    const deleteNamespace = async (paramsObj: { envCode:string, namespaceId: number }) => {
      setLoading(true);
      await delRequest(APIS.deleteNamespaceApi,{data:paramsObj})
        .then((result) => {
          if (result.success) {
            message.success('删除成功！');
          } else {
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    return [loading, deleteNamespace];
  }