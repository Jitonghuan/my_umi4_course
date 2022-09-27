import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../../service';
import { message } from 'antd';
import { getRequest, postRequest, delRequest } from '@/utils/request';
type AnyObject = Record<string, any>;
export interface CreateIndentItems{
  indentName: string;
  indentDescription: string;
  deliveryProject: string;
  productName: string;
  productVersion: string;
}
// 创建制品
export function useCreateIndent(): [
  boolean,
  (paramsObj: CreateIndentItems) => Promise<void>,
] {
  const [loading, setLoading] = useState(false);
  const createIndent = async (paramsObj: CreateIndentItems) => {
    setLoading(true);
    try {
      await postRequest(APIS.createIndent, { data: paramsObj })
        .then((res) => {
          if (res.success) {
            message.success('创建制品成功!');
          } else {
            // message.error('创建制品失败！');
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
  return [loading, createIndent];
}

// 查询产品列表
export function useQueryProductList(): [boolean, any[], () => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    queryProductList();
  }, []);
  const queryProductList = async () => {
    setLoading(true);
    try {
      await getRequest(APIS.queryProductList, {
        data: { pageSize: -1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource || [];
            let dataArry: any = [];
            dataSource?.map((item: any) => {
              dataArry.push({
                label: item.productName,
                value: item.id,
              });
            });
            setDataSource(dataArry);
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

// 查询产品版本
export function useQueryProductVersionList(): [boolean, any[], (product_id: number) => Promise<void>] {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const queryProductVersionList = async (productId: number) => {
    setLoading(true);
    try {
      await getRequest(APIS.queryVersionList, {
        data: { productId, pageSize: -1, releaseStatus: 1 },
      })
        .then((res) => {
          if (res.success) {
            let dataSource = res.data.dataSource || [];
            let dataArry: any = [];
            dataSource?.map((item: any) => {
              dataArry.push({
                label: item.versionName,
                value: item.versionName,
              });
            });
            setDataSource(dataArry);
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
  return [loading, dataSource, queryProductVersionList];
}
