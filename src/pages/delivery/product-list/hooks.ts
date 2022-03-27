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
