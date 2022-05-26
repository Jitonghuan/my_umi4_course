import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { message } from '@cffe/h2o-design';
import { getRequest, postRequest, delRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
// 创建产品
export function useCreateProduct(): [boolean, (productName: string, productDescription: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const createProduct = async (productName: string, productDescription: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.createProduct, { data: { productName, productDescription } })
        .then((res) => {
          if (res.success) {
            message.success('创建产品成功!');
          } else {
            message.error('创建产品失败！');
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
  return [loading, createProduct];
}

// 删除产品
export function useDeleteProduct(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const deleteProduct = async (id: number) => {
    setLoading(true);
    try {
      await delRequest(`${APIS.deleteProduct}/${id}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('删除失败！');
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
  return [loading, deleteProduct];
}

// 查询产品列表
export function useQueryProductList(): [
  boolean,
  any[],
  any,
  any,
  (pageIndex?: any, pageSize?: any, productName?: string) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  useEffect(() => {
    queryProductList();
  }, []);
  const queryProductList = async (pageIndex?: number, pageSize?: number, productName?: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryProductList, {
        data: { pageIndex: pageIndex || 1, pageSize: pageSize || 20, productName },
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
  return [loading, dataSource, pageInfo, setPageInfo, queryProductList];
}
