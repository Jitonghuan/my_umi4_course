import { useState, useEffect, useCallback, useRef } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from './service';
import type * as ITERFACES from './interface';

export function useAppCateEnum() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(APIS.getAppCateList).then((result) => {
      const source = (result.data || []).map((n: any) => ({
        label: n.categoryName,
        value: n.id,
      }));

      setData(source);
    });
  }, []);

  return [data];
}

export function useAppCodeEnum() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(APIS.getAppCodeList).then((result) => {
      const source = (result.data || []).map((n: any) => ({
        label: n.categoryCode,
        value: n.id,
      }));

      setData(source);
    });
  }, []);

  return [data];
}

export function useAllAppCodeQualityConf(keyword: string) {
  const [data, setData] = useState<ITERFACES.IConfig[]>([]);

  useEffect(() => {
    getRequest(APIS.getAllAppCodeQualityConf).then((res) => {
      setData(res.data || []);
    });
  }, []);

  if (keyword?.length) {
    return [data.filter((item) => item.appCode.includes(keyword) || item.categoryCode.includes(keyword))];
  }

  return [data];
}
