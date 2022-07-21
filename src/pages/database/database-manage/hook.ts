import { useState, useEffect } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from '../service';
import { message } from 'antd';

//数据库管理-新建数据库
export function useCreateSchema(): [
  boolean,
  (paramsObj: {
    clusterId: number;
    name: string;
    characterset: string;
    owner: string;
    accountId: number;
    description: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createSchema = async (paramsObj: {
    clusterId: number;
    name: string;
    characterset: string;
    owner: string;
    accountId: number;
    description: string;
  }) => {
    setLoading(true);
    await postRequest(`${APIS.createSchema}`, { data: paramsObj })
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

  return [loading, createSchema];
}
//数据库管理-删除数据库
export function useDeleteSchema(): [boolean, (paramsObj: { clusterId: number; id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteSchema = async (paramsObj: { clusterId: number; id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteSchema}?clusterId=${paramsObj?.clusterId}&id=${paramsObj?.id}`)
      .then((result) => {
        if (result?.success) {
          message.success(result?.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, deleteSchema];
}

//账号管理-账号列表
export function useGetAccountList(): [boolean, any, (paramsObj: { clusterId: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const getAccountList = async (paramsObj: { clusterId: number }) => {
    setLoading(true);
    await getRequest(`${APIS.getAccountList}`, { data: { ...paramsObj, pageIndex: -1, pageSize: -1 } })
      .then((result) => {
        if (result.success) {
          let dataSource = result?.data?.dataSource;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({
              label: item?.user,
              value: item?.id,
            });
          });
          setData(dataArry || []);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getAccountList];
}

export function useUserOptions() {
  const [source, setSource] = useState<any[]>([]);

  useEffect(() => {
    getRequest(APIS.getUserList).then((result) => {
      const { usernames } = result.data || {};
      const next = (usernames || []).map((item: string) => ({
        label: item,
        value: item,
        key: item,
      }));

      setSource(next);
    });
  }, []);

  return [source];
}

//账号管理-账号列表
export function useGetCharacterSetList(): [boolean, any, (paramsObj: { clusterId: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const getCharacterSetList = async (paramsObj: { clusterId: number }) => {
    setLoading(true);
    await getRequest(`${APIS.getCharacterSetList}`, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          let dataSource = result?.data;
          let dataArry: any = [];
          dataSource?.map((item: any) => {
            dataArry.push({
              label: item,
              value: item,
            });
          });

          setData(dataArry || []);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getCharacterSetList];
}
