// 全局通用的 hooks
// @file hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/10 11:37

import { useState, useEffect, useCallback, createContext } from 'react';
import type { IPermission } from '@cffe/vc-layout/lib/sider-menu';
import appConfig from '@/app.config';
import { getRequest } from '@/utils/request';
import * as APIS from './apis';

/** 全局上下文 */
export const FeContext = createContext({
  /** 面包屑路由数据 */
  breadcrumbMap: {} as Record<string, any>,
  /** 是否开启权限控制 */
  isOpenPermission: false,
  /** 权限数据 */
  permissionData: [] as IPermission[],
  /** 应用分类数据 */
  categoryData: [] as IOption[],
  /** 应用组 */
  businessData: [] as IOption[],
  /** 环境类型枚举 */
  envTypeData: [] as IOption[],
});

/** 修改标题和 favicon */
export function useDocumentTitle(subtitle?: string) {
  useEffect(() => {
    const link: any = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = appConfig.favicon;
    document.getElementsByTagName('head')[0].appendChild(link);

    setTimeout(() => {
      document.title = subtitle ? `${appConfig.title} | ${subtitle}` : appConfig.title;
    });
  }, []);
}

/** 页面权限数据 */
export function usePermissionData(): [IPermission[], boolean, () => Promise<any>] {
  const [data, setData] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRequest(APIS.queryPermission);
      const next =
        result.data?.map((item: any) => ({
          permissionId: item.menuCode,
          permissionName: item.menuName,
          permissionUrl: item.menuUrl,
        })) || [];

      setData(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (appConfig.isOpenPermission) {
      loadData();
    }
  }, []);

  return [data, loading, loadData];
}

// 业务所属
export function useCategoryData() {
  const [data, setData] = useState<IOption[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(APIS.queryCategoryData);
    const next = (result.data?.dataSource || []).map((el: any) => ({
      ...el,
      label: el?.categoryName,
      value: el?.categoryCode,
    }));
    setData(next);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data];
}

// 业务线
export function useBusinessData() {
  const [data, setData] = useState<IOption[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(APIS.queryBizData);
    const next = (result.data?.dataSource || []).map((el: any) => ({
      ...el,
      label: el?.groupName,
      value: el?.groupCode,
    }));
    setData(next);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data];
}

// 环境类型数据
export function useEnvTypeData() {
  const [data, setData] = useState<IOption[]>([]);

  const loadData = useCallback(async () => {
    const result = await getRequest(APIS.queryEnvTypeData);
    const next = (result.data || []).map((el: any) => ({
      ...el,
      label: el?.typeName,
      value: el?.typeCode,
    }));
    setData(next);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data];
}
