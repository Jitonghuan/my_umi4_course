// application hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/24 09:21

import { useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import { queryBizData } from '@/common/apis';
import {
  queryApps,
  queryAppEnvs,
  queryAppsUrl,
  queryMyAppsUrl,
  queryMyCollectUrl,
  cancelCollection,
  addCollection,
} from './service';
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
        const { dataSource } = result?.data || {};
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
  const typeObj: any = {
    collect: queryMyCollectUrl,
    mine: queryMyAppsUrl,
    all: queryAppsUrl,
  };

  const loadData = useCallback(
    async (extra?: any) => {
      const { requestType, ...others } = params || {};
      const requestData = { ...others, ...extra, pageIndex, pageSize };
      if (requestType === 'collect') {
        Object.assign(requestData, { collectionType: 'application' });
      }
      const url = typeObj[requestType] || queryAppsUrl;
      try {
        setLoading(true);
        const result = await getRequest(url, {
          data: { ...requestData },
        });
        const { dataSource, pageInfo } = result?.data || {};
        setData(dataSource || []);
        setTotal(pageInfo?.total || 0);
      } catch (ex) {
        setTotal(0);
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
export function useAppDetail( appCode?: string): [AppItemVO | undefined, boolean, () => Promise<void>] {
  const [data, setData] = useState<AppItemVO>();
  const [loading, setLoading] = useState(false);
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const appList = await queryApps({
     //   id: appId || undefined,
        // 有 appId 时就不需要 appCode
        appCode:  appCode,
        pageIndex: 1,
        pageSize: 10,
      });
      appList?.map((item: any) => {
        if (appCode) {
          if (item?.appCode === appCode) {
            setData(item);
          }
          return;
        } 
        // else if (appId) {
        //   if (item?.id === appId) {
        //     setData(item);
        //   }
        //   return;
        // }
      });
    } finally {
      setLoading(false);
    }
  }, [ appCode]);

  useEffect(() => {
    if ( !appCode) {
      setLoading(false);
      return setData(undefined);
    }

    loadData();
  }, [ appCode]);

  return [data, loading, loadData];
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
      const next: EnvDataVO[] = result?.data || [];
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
