// layout hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 15:15

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import { queryCategoryData, queryBizData, queryEnvTypeData } from './service';

// 业务所属
export function useCategoryData(ready = false) {
  const [data, setData] = useState<IOption[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(queryCategoryData);
    const next = (result.data?.dataSource || []).map((el: any) => ({
      ...el,
      label: el?.categoryName,
      value: el?.categoryCode,
    }));
    setData(next);
  }, []);

  useEffect(() => {
    if (ready) {
      loadData();
    }
  }, [ready]);

  return [data];
}

// 业务线
export function useBusinessData(ready = false) {
  const [data, setData] = useState<IOption[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(queryBizData);
    const next = (result.data?.dataSource || []).map((el: any) => ({
      ...el,
      label: el?.groupName,
      value: el?.groupCode,
    }));
    setData(next);
  }, []);

  useEffect(() => {
    if (ready) {
      loadData();
    }
  }, [ready]);

  return [data];
}

// 环境类型数据
export function useEnvTypeData(ready = false) {
  const [data, setData] = useState<IOption[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(queryEnvTypeData);
    const next = (result.data || []).map((el: any) => ({
      ...el,
      label: el?.typeName,
      value: el?.typeCode,
    }));
    setData(next);
  }, []);

  useEffect(() => {
    if (ready) {
      loadData();
    }
  }, [ready]);

  return [data];
}
