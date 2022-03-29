import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { message } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
//编辑产品描述
export function useEditProductDescription(): [boolean, (id: number, product_description: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const editProductDescription = async (id: number, product_description: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.editProductDescription, { data: { id, product_description } })
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('编辑产品描述失败！');
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
  return [loading, editProductDescription];
}

// 创建产品版本
export function useCreateProductVersion(): [
  boolean,
  (product_id: number, version_name: string, version_description: string) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const createProductVersion = async (product_id: number, version_name: string, version_description: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.createProductVersion, { data: { product_id, version_name, version_description } })
        .then((res) => {
          if (res.success) {
            message.success('创建产品版本成功!');
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
  return [loading, createProductVersion];
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
  (pageIndex?: any, pageSize?: any, product_name?: string) => Promise<void>,
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
  const queryProductList = async (pageIndex?: number, pageSize?: number, product_name?: string) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryProductList, {
        data: { pageIndex: pageIndex || 1, pageSize: pageSize || 20, product_name },
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
