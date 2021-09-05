// application hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/24 09:21

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import { queryBizData } from '@/layouts/basic-layout/service';
import { queryApps, queryAppEnvs, queryAppsUrl, queryMyAppsUrl } from './service';
import { AppItemVO, EnvDataVO } from './interfaces';

// 获取应用分组选项
export function useAppGroupOptions(categoryCode?: string): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData([]);
    if (!categoryCode) return;

    setLoading(true);
    getRequest(queryBizData, {
      data: { categoryCode },
    })
      .then((result) => {
        const { dataSource } = result.data || {};
        const next = (dataSource || []).map((item: any) => ({
          ...item,
          value: item.groupCode,
          label: item.groupName,
        }));

        setData(next);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryCode]);

  return [data, loading];
}

// 获取应用列表
export function useAppListData(
  params: Record<string, any>,
  pageIndex = 1,
  pageSize = 20,
): [AppItemVO[], number, boolean, (extra?: any) => Promise<any>] {
  const [data, setData] = useState<AppItemVO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(
    async (extra?: any) => {
      const { requestType, ...others } = params || {};
      const url = requestType === 'mine' ? queryMyAppsUrl : queryAppsUrl;
      try {
        setLoading(true);
        const result = await getRequest(url, {
          data: {
            ...others,
            ...extra,
            pageIndex,
            pageSize,
          },
        });
        const { dataSource, pageInfo } = result.data || {};
        setData(dataSource || []);
        setTotal(pageInfo?.total || 0);
      } catch (ex) {
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [params, pageIndex, pageSize],
  );

  useEffect(() => {
    loadData({});
  }, [params, pageIndex, pageSize]);

  return [data, total, loading, loadData];
}

// 获取应用详情
export function useAppDetail(appId?: number, appCode?: string): [AppItemVO | undefined, () => Promise<void>] {
  const [data, setData] = useState<AppItemVO>();

  const loadData = useCallback(async () => {
    const appList = await queryApps({
      id: appId || undefined,
      // 有 appId 时就不需要 appCode
      appCode: appId ? undefined : appCode,
      pageIndex: 1,
      pageSize: 10,
    });

    setData(appList?.[0]);
  }, [appId, appCode]);

  useEffect(() => {
    if (!appId && !appCode) {
      return setData(undefined);
    }

    loadData();
  }, [appId, appCode]);

  return [data, loadData];
}

/**
 * 获取应用下的环境列表，返回的数据按 envTypeCode 分组
 */
export function useAppEnvCodeData(appCode?: string): [Record<string, EnvDataVO[]>, boolean] {
  const [data, setData] = useState<Record<string, EnvDataVO[]>>({});
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!appCode) {
      return setData({});
    }

    setLoading(true);
    try {
      const result = await getRequest(queryAppEnvs, {
        data: {
          appCode,
          pageSize: -1,
        },
      });
      const next: EnvDataVO[] = result.data?.dataSource || [];
      // 根据 envTypeCode 分成多组
      const map: Record<string, EnvDataVO[]> = {};
      next.forEach((n) => {
        map[n.envTypeCode] = map[n.envTypeCode] || [];
        map[n.envTypeCode].push(n);
      });
      setData(map);
    } finally {
      setLoading(false);
    }
  }, [appCode]);

  useEffect(() => {
    loadData();
  }, [appCode]);

  return [data, loading];
}
