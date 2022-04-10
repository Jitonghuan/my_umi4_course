import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest, putRequest } from '@/utils/request';

//创建应用Chart模板

export function useCreateComponentTmpl(): [
  boolean,
  (params: { tempName: string; productLine: string; tempType: string; tempConfiguration: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createComponentTmpl = async (params: {
    tempName: string;
    productLine: string;
    tempType: string;
    tempConfiguration: string;
  }) => {
    setLoading(true);
    try {
      await postRequest(APIS.createComponentTmpl, { data: params })
        .then((res) => {
          if (res.success) {
            message.success('新建组件模板成功！');
          } else {
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, createComponentTmpl];
}

//更新应用Chart模板

export function useUpdateComponentTmpl(): [
  boolean,
  (params: {
    id: number;
    tempName: string;
    productLine: string;
    tempType: string;
    tempConfiguration: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateComponentTmpl = async (params: {
    id: number;
    tempName: string;
    productLine: string;
    tempType: string;
    tempConfiguration: string;
  }) => {
    setLoading(true);
    try {
      await putRequest(APIS.updateComponentTmpl, { data: params })
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, updateComponentTmpl];
}
