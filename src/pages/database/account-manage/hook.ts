import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';
import { CreateAccountItem } from '../interfaces';
export const createAccount = async (paramsObj: CreateAccountItem) => {
  return await postRequest(`${APIS.createAccount}`, { data: paramsObj });
};

//新建账号
export function useCreateAccount(): [boolean, (paramsObj: CreateAccountItem) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const createAccount = async (paramsObj: CreateAccountItem) => {
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

//grantAccount
export function useGrantAccount(): [
  boolean,
  (paramsObj: {
    clusterId: number;
    id: number;
    grantType: number;
    privType: string;
    privs: any;
    object: any;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const grantAccount = async (paramsObj: {
    clusterId: number;
    id: number;
    grantType: number;
    privType: string;
    privs: any;
    object: any;
  }) => {
    setLoading(true);
    await postRequest(`${APIS.grantAccount}`, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
          message.success(result.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, grantAccount];
}

//数据库管理-数据库列表
export function useGetSchemaList(): [boolean, any, (paramsObj: { clusterId: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const getSchemaList = async (paramsObj: { clusterId: number }) => {
    setLoading(true);
    await getRequest(`${APIS.getSchemaList}`, { data: { ...paramsObj, pageIndex: -1, pageSize: -1 } })
      .then((result) => {
        if (result.success) {
          let dataSource = result?.data?.dataSource;
          const dataArry = dataSource?.map((item: any) => ({
            label: item?.name,
            value: item?.name,
          }));
          setData(dataArry || []);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getSchemaList];
}
