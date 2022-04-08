import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
type AnyObject = Record<string, any>;

//组件查询
export function useQueryComponentList(): [
  boolean,
  any,
  any,
  any,
  (componentType: string, componentName?: string, pageIndex?: number, pageSize?: number) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  const queryComponentList = async (
    componentType: string,
    componentName?: string,
    pageIndex?: number,
    pageSize?: number,
  ) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentList, {
        data: { componentType, componentName, pageIndex: pageIndex || 1, pageSize: pageSize || 20 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource;
            let pageInfo = res.data.pageInfo;
            setDataSource(dataSource);
            setPageInfo({
              pageIndex: pageInfo.pageIndex,
              pageSize: pageInfo.pageSize,
              total: pageInfo.total,
            });
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
  return [loading, dataSource, pageInfo, setPageInfo, queryComponentList];
}

//用户组件接入
export function useAddApplication(): [
  boolean,
  (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentSource_env: string;
    productLine: string;
    componentUrl?: string;
    componentExplanation?: string;
    componentConfiguration?: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addApplication = async (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentSource_env: string;
    productLine: string;
    componentUrl?: string;
    componentExplanation?: string;
    componentConfiguration?: string;
  }) => {
    setLoading(true);
    try {
      await postRequest(APIS.addApplication, { data: paramsObj })
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
  return [loading, addApplication];
}

//中间件接入
export function useAddMiddleware(): [
  boolean,
  (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentUrl: string;
    componentSource_env: string;
    componentExplanation: string;
    componentConfiguration: string;
    productLine: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addMiddleware = async (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentUrl: string;
    componentSource_env: string;
    componentExplanation: string;
    componentConfiguration: string;
    productLine: string;
  }) => {
    setLoading(true);
    try {
      await postRequest(APIS.addMiddleware, { data: paramsObj })
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
  return [loading, addMiddleware];
}

//基础数据接入
export function useAddBasicdata(): [
  boolean,
  (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentUrl: string;
    componentSource_env: string;
    componentExplanation: string;
    componentConfiguration: string;
    productLine: string;
  }) => Promise<void>,
] {
  const [loading, setLoading] = useState<boolean>(false);
  const addBasicdata = async (paramsObj: {
    componentName: string;
    componentVersion: string;
    componentType: string;
    componentDescription: string;
    componentUrl: string;
    componentSource_env: string;
    componentExplanation: string;
    componentConfiguration: string;
    productLine: string;
  }) => {
    setLoading(true);
    try {
      await postRequest(APIS.addBasicdata, { data: paramsObj })
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
  return [loading, addBasicdata];
}

//删除交付配置参数

export function useDeleteComponent(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteComponent = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.deleteComponent}/${id}`)
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
  return [loading, deleteComponent];
}
