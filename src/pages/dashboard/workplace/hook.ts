//管理员页面接口文档
//接口文档地址：https://come-future.yuque.com/sekh46/bbgc7f/qo3mcm
//2022/06/14 13:50
import { addAPIPrefix } from '@/utils';
import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';

//查询我的快捷入口
export function useMyEntryMenuList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<any>([]);
  const getMyEntryMenuList = async () => {
    setLoading(true);
    await getRequest(`${APIS.getMyEntryMenuList}`)
      .then((result) => {
        if (result?.success) {
          const dataSource = result.data || [];

          setSource(dataSource);
        }
        if (!result?.success) {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, source, setSource, getMyEntryMenuList];
}

//新增
export function useAddMyEntryMenu(): [
  boolean,
  (paramsObj: { title: string; content: string; type: string; priority: number }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createArticle = async (paramsObj: { title: string; content: string; type: string; priority: number }) => {
    setLoading(true);
    await postRequest(APIS.createMyEntryMenu, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success('新增快捷入口成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, createArticle];
}

//删除
export function useDeleteArticle(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteArticle = async (paramsObj: { id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteMyEntryMenu}/${paramsObj.id}`)
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

  return [loading, deleteArticle];
}

//getInfoList
export function useGetInfoList(): [
  boolean,
  number,
  any,
  (paramsObj: { type: string; pageIndex?: number; pageSize?: number }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const getInfoList = async (paramsObj: { type: string; pageIndex?: number; pageSize?: number }) => {
    setLoading(true);
    await getRequest(APIS.getInfoList, { data: { type: paramsObj.type, pageIndex: -1, pageSize: -1 } })
      .then((result) => {
        if (result.success) {
          let dataSource = result?.data?.dataSource;
          setData(dataSource);
          setTotal(result?.data?.pageInfo?.total);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, total, data, getInfoList];
}
