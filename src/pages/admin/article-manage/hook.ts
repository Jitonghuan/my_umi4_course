import { useState } from 'react';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';
import * as APIS from './service';
import { message } from 'antd';

//新增
export function useAddArticle(): [
  boolean,
  (paramsObj: { title: string; content: string; type: string; priority: number }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createArticle = async (paramsObj: { title: string; content: string; type: string; priority: number }) => {
    setLoading(true);
    await postRequest(APIS.createInfo, { data: paramsObj })
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
  (paramsObj: { id: number; title: string; content: string; type: string; priority: number }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateArticle = async (paramsObj: {
    id: number;
    title: string;
    content: string;
    type: string;
    priority: number;
  }) => {
    setLoading(true);
    await putRequest(APIS.updateInfo, { data: paramsObj })
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
    await delRequest(`${APIS.deleteInfo}/${paramsObj.id}`)
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
