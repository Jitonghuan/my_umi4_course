import { useState,} from 'react';
import * as APIS from '../../service';
import { message } from 'antd';
import {postRequest, putRequest } from '@/utils/request';

//创建应用Chart模板
interface chartsItems{
  id?: number;
  tempName: string;
  productLine: string;
  tempType: string;
  tempConfiguration: string 

}

export function useCreateComponentTmpl(): [
  boolean,
  (params: chartsItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const createComponentTmpl = async (params:chartsItems) => {
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
  (params: chartsItems) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const updateComponentTmpl = async (params: chartsItems) => {
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
