import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

//新建账号
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

//修改密码
export function useChangePassword(): [
  boolean,
  (paramsObj: { clusterId: number; password: string; id: number }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const changePassword = async (paramsObj: { clusterId: number; password: string; id: number }) => {
    setLoading(true);
    await putRequest(`${APIS.changePassword}`, { data: paramsObj })
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

  return [loading, changePassword];
}

//deleteAccount
export function useDeleteAccount(): [boolean, (paramsObj: { clusterId: number; id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteAccount = async (paramsObj: { clusterId: number; id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteAccount}?clusterId=${paramsObj?.clusterId}&id=${paramsObj?.id}`)
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

  return [loading, deleteAccount];
}
