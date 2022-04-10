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
  (paramObj: { pageIndex?: any; pageSize?: any; productLine?: string; tempType?: string }) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  useEffect(() => {
    queryTemplateList({ pageIndex: 1, pageSize: 20 });
  }, []);
  const queryTemplateList = async (paramObj: {
    pageIndex?: any;
    pageSize?: any;
    productLine?: string;
    tempType?: string;
  }) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryComponentTmpl, {
        data: paramObj,
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

// 应用Chart模板分类
export function useGetTypeListOption(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  useEffect(() => {
    getTypeListOption();
  }, []);
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
      await delRequest(`${APIS.deleteComponentTmpl}?id=${id}`)
        .then((res) => {
          if (res.success) {
            message.success('删除组件模板成功！');
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
