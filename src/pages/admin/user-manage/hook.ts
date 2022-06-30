import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';

import { message } from 'antd';

//删除用户角色
export function useDeleteUserRole(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteUserRole = async (paramsObj: { id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteUserRole}/${paramsObj.id}`)
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

  return [loading, deleteUserRole];
}

//更新用户信息
export function useUpdateUser(): [
  boolean,
  (paramsObj: { id: number; email: string; mobile: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateUser = async (paramsObj: { id: number; email: string; mobile: string }) => {
    setLoading(true);
    await putRequest(`${APIS.updateUser}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success('更新用户信息成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateUser];
}

//新增用户角色
export function useCreateUserRole(): [
  boolean,
  (paramsObj: { id: number; groupCode: string; categoryCode: string; role: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createUserRole = async (paramsObj: { id: number; groupCode: string; categoryCode: string; role: string }) => {
    setLoading(true);
    await postRequest(`${APIS.createUserRole}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success('新增用户角色成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, createUserRole];
}

//更新用户角色
export function useUpdateUserRole(): [
  boolean,
  (paramsObj: { id: number; groupCode: string; categoryCode: string; role: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateUserRole = async (paramsObj: { id: number; groupCode: string; categoryCode: string; role: string }) => {
    setLoading(true);
    await putRequest(`${APIS.updateUserRole}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success('更新用户角色成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateUserRole];
}
