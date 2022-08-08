import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';
import { CreateUserProps, CreateUserRoleProps } from './types';
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
export function useCreateUserRole(): [boolean, (paramsObj: CreateUserRoleProps) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const createUserRole = async (paramsObj: CreateUserRoleProps) => {
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
//createUser
//新增用户
export function useCreateUser(): [boolean, (paramsObj: CreateUserProps) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const createUser = async (paramsObj: CreateUserProps) => {
    setLoading(true);
    await postRequest(`${APIS.createUser}`, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
          message?.success('新增用户成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, createUser];
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

// 获取应用分组选项
export function useAppGroupOptions(categoryCode?: string): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData([]);
    if (!categoryCode) return;

    setLoading(true);
    getRequest(APIS.queryBizData, {
      data: { categoryCode },
    })
      .then((result) => {
        const { dataSource } = result?.data || {};
        const next = (dataSource || []).map((item: any) => ({
          ...item,
          value: item.groupCode,
          label: item.groupName,
        }));

        setData(next);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryCode]);

  return [data, loading];
}

/* 查询对应人的角色信息 */
export const queryRoleData = (name: string) => {
  return getRequest(APIS.getUserList, { data: { name, pageSize: -1 } }).then((res) => {
    if (res?.success) {
      const dataSource = res?.data?.dataSource || [];
      return dataSource;
    }
  });
};
