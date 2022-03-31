import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
type AnyObject = Record<string, any>;

//查询版本详情
export function useVersionDescriptionInfo(): [boolean, any, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const getVersionDescriptionInfo = async (id: number) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryProductVersionInfo, { data: { id } })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data);
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
  return [loading, dataSource, getVersionDescriptionInfo];
}
//编辑产品版本描述
export function useEditProductVersionDescription(): [
  boolean,
  (id: number, version_description: string) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const editProductVersionDescription = async (id: number, version_description: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.editVersionDescription, { data: { id, version_description } })
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('编辑产品版本描述失败！');
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
  return [loading, editProductVersionDescription];
}
