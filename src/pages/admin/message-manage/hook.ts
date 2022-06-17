import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';

import { message } from 'antd';

//新增
export function useAddArticle(): [
  boolean,
  (paramsObj: { title: string; content: string; type: string; targetId?: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createArticle = async (paramsObj: { title: string; content: string; type: string; targetId?: string }) => {
    setLoading(true);
    await postRequest(APIS.sendSystemNotice, { data: paramsObj })
      .then((result) => {
        if (result.success) {
          message.success('新增成功！');
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

//修改
export function useUpdateArticle(): [
  boolean,
  (paramsObj: { id: number; title: string; content: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateArticle = async (paramsObj: { id: number; title: string; content: string }) => {
    setLoading(true);
    await putRequest(APIS.updateContent, { data: paramsObj })
      .then((result) => {
        if (result?.success) {
          message.success('修改成功！');
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, updateArticle];
}

//删除
export function useDeleteArticle(): [boolean, (paramsObj: { id: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteArticle = async (paramsObj: { id: number }) => {
    setLoading(true);
    await delRequest(`${APIS.deleteContent}/${paramsObj.id}`)
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

//
export function useSearchUser(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const searchUser = async () => {
    setLoading(true);
    await getRequest(APIS.searchUserUrl, { data: { pageIndex: -1, pageSize: -1 } })
      .then((result) => {
        if (result.success) {
          console.log('result', result);
          let dataSource = result?.data?.dataSource;
          const data = dataSource?.map((item: any) => ({ label: item.username, value: item.username, key: item.id }));
          setData(data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, searchUser];
}
