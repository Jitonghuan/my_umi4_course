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
  (id: number, versionDescription: string) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const editProductVersionDescription = async (id: number, versionDescription: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.editVersionDescription, { data: { id, versionDescription } })
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
  return [loading, editProductVersionDescription];
}

//组件查询
export function useQueryComponentOptions(): [boolean, any[], (componentType: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryComponentOptions = async (componentType: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentList, {
        data: { componentType, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            const options =
              dataSource ||
              [].map((item: any) => ({
                label: item.id,
                value: item.componentName,
              }));
            setDataSource(options);
          } else {
            return [];
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, dataSource, queryComponentOptions];
}

//组件版本查询
export function useQueryComponentVersionOptions(): [boolean, any[], (componentName: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryProductVersionOptions = async (componentName: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentVersionList, {
        data: { componentName, pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            const options =
              dataSource ||
              [].map((item: any) => ({
                label: item.component_version,
                value: item.component_version,
              }));
            setDataSource(options);
          } else {
            return [];
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return [loading, dataSource, queryProductVersionOptions];
}
