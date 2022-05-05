import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
//编辑产品描述
export function useEditProductDescription(): [boolean, (id: number, productDescription: string) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const editProductDescription = async (id: number, productDescription: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.editProductDescription, { data: { id, productDescription } })
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
  (productId: number, versionName: string, versionDescription: string) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const createProductVersion = async (productId: number, versionName: string, versionDescription: string) => {
    setLoading(true);
    try {
      await postRequest(APIS.createProductVersion, { data: { productId, versionName, versionDescription } })
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

// 删除产品版本
export function useDeleteProductVersion(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const deleteProductVersion = async (id: number) => {
    setLoading(true);
    try {
      await delRequest(`${APIS.deleteVersion}/${id}`)
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
  return [loading, deleteProductVersion];
}

// 查询产品版本
export function useQueryProductList(): [
  boolean,
  any[],
  any,
  any,
  (productId: number, pageIndex?: any, pageSize?: any) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  });
  const queryProductVersionList = async (productId: number, pageIndex?: number, pageSize?: number) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryVersionList, {
        data: { productId, pageIndex: pageIndex || 1, pageSize: pageSize || 20 },
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
  return [loading, dataSource, pageInfo, setPageInfo, queryProductVersionList];
}

// 发布产品版本
export function usePublishProductVersion(): [boolean, (id: number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const publishProductVersion = async (id: number) => {
    setLoading(true);
    try {
      await postRequest(`${APIS.releaseVersion}?id=${id}`)
        .then((res) => {
          if (res.success) {
            message.success(res.data);
          } else {
            message.error('发布版本失败！');
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
  return [loading, publishProductVersion];
}
