import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

//数据库管理-新建数据库
export function useCreateAccount(): [
  boolean,
  (paramsObj: {
    clusterId: number;
    user: string;
    host: string;
    password: string;
    description: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createAccount = async (paramsObj: {
    clusterId: number;
    user: string;
    host: string;
    password: string;
    description: string;
  }) => {
    setLoading(true);
    await postRequest(`${APIS.createAccount}`, { data: paramsObj })
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

  return [loading, createAccount];
}
