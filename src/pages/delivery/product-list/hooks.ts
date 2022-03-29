import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
// 创建产品
export function useCreateProduct(): [boolean, (product_name: string, product_description: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const createProduct = async (product_name: string, product_description: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.createProduct, { data: { product_name, product_description } })
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
      await postRequest(APIS.deleteProduct, { data: { id } })
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
  return [loading, deleteProduct];
}

// 查询产品列表
export function useQueryProductList(): [
  boolean,
  any[],
  (product_name?: string, pageIndex?: number, pageSize?: number) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    queryProductList();
  }, []);
  const queryProductList = async (product_name?: string, pageIndex?: number, pageSize?: number) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryProductList, {
        data: { product_name, pageIndex: pageIndex || 1, pageSize: pageSize || 20 },
      })
        .then((res) => {
          if (res.success) {
            setDataSource(res.data.dataSource);
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
  return [loading, dataSource, queryProductList];
}
