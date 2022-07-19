import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

//新建账号
export function useAddInstance(): [
  boolean,
  (paramsObj: {
    name: string;
    instanceType: number;
    instanceVersion: string;
    clusterId: number;
    clusterRole: number;
    instanceHost: string;
    instancePort: string;
    manageUser: string;
    managePassword: string;
    description: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addInstance = async (paramsObj: {
    name: string;
    instanceType: number;
    instanceVersion: string;
    clusterId: number;
    clusterRole: number;
    instanceHost: string;
    instancePort: string;
    manageUser: string;
    managePassword: string;
    description: string;
  }) => {
    setLoading(true);
    await postRequest(`${APIS.addInstance}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, addInstance];
}
