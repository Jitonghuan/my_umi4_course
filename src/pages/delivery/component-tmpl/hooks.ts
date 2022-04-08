import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
// 应用Chart模板列表查询
export function useQueryTemplateList(): [
  boolean,
  any[],
  any,
  any,
  (pageIndex?: any, pageSize?: any, productLine?: string, tempType?: string) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  // useEffect(() => {
  //   queryTemplateList();
  // }, []);
  const queryTemplateList = async (pageIndex?: any, pageSize?: any, productLine?: string, tempType?: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentTmpl, {
        data: {
          pageIndex: pageIndex || 1,
          pageSize: pageSize || 20,
          productLine: productLine || '',
          tempType: tempType || '',
        },
      })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data.dataSource);

            let pageInfoData = res.data.pageInfo;
            setPageInfo({
              pageIndex: pageInfoData.pageIndex,
              pageSize: pageInfoData.pageSize,
              total: pageInfoData.total,
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
  return [loading, dataSource, pageInfo, setPageInfo, queryTemplateList];
}

// 应用查询
export function useGetApplicationOption(): [boolean, any, (component_source_env: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const getApplicationOption = async (componentSourceEnv: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.queryApplist, { data: { componentSourceEnv } })
        .then((res) => {
          if (res.success) {
            let data = res.data;
            const option = data?.map((item: any) => ({
              label: item,
              value: item,
            }));
            setDataSource(option);
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
  return [loading, dataSource, getApplicationOption];
}

// 应用Chart模板分类
export function useGetTypeListOption(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  // useEffect(() => {
  //   getTypeListOption();
  // }, []);
  const getTypeListOption = async () => {
    setLoading(true);
    try {
      await getRequest(APIS.queryTypeList)
        .then((res) => {
          if (res.success) {
            let data = res.data;
            const option = data?.map((item: any) => ({
              label: item,
              value: item,
            }));
            setDataSource(option);
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
  return [loading, dataSource, getTypeListOption];
}

//删除应用Chart模板

export function useDeleteComponentTmpl(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteComponentTmpl = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.deleteComponentTmpl}/${id}`)
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
  return [loading, deleteComponentTmpl];
}
