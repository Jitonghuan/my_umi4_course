// deploy info hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/18 09:48

import { useState, useEffect, useCallback } from 'react';
import * as APIS from './services';
import { getRequest } from '@/utils/request';
import { EnvDataVO, IStatusInfoProps } from '../../types';

// 获取应用下的环境列表
export function useAppEnvList(appCode?: string): [EnvDataVO[], boolean] {
  const [data, setData] = useState<EnvDataVO[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!appCode) return;

    setLoading(true);
    try {
      const result = await getRequest(APIS.queryAppEnvs, {
        data: {
          appCode,
          pageSize: -1,
        },
      });
      const next: EnvDataVO[] = result.data?.dataSource || [];
      // 通过 envTypeCode 过滤出线上环境
      setData(next.filter((n) => n.envTypeCode === 'prod'));
    } finally {
      setLoading(false);
    }
  }, [appCode]);

  useEffect(() => {
    loadData();
  }, [appCode]);

  return [data, loading];
}

// 获取部署信息
export function useAppDeployInfo(
  envCode?: string,
  deploymentName?: string,
): [IStatusInfoProps[], boolean, (showLoading?: boolean) => Promise<any>] {
  const [data, setData] = useState<IStatusInfoProps[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(
    async (showLoading = true) => {
      if (!envCode || !deploymentName) return;

      showLoading && setLoading(true);
      try {
        const result = await getRequest(APIS.queryApplicationStatus, {
          data: { deploymentName, envCode },
        });

        const { Status: nextAppStatus } = result.data || {};
        setData(nextAppStatus || []);
      } finally {
        setLoading(false);
      }
    },
    [envCode, deploymentName],
  );

  useEffect(() => {
    loadData();
  }, [envCode, deploymentName]);

  return [data, loading, loadData];
}

// 获取应用变更记录列表
export function useAppChangeOrder(
  envCode?: string,
  deploymentName?: string,
): [any[], boolean, (showLoading?: boolean) => Promise<any>] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(
    async (showLoading = true) => {
      if (!envCode || !deploymentName) return;

      showLoading && setLoading(true);
      try {
        const result = await getRequest(APIS.queryRecentChangeOrder, {
          data: { deploymentName, envCode },
        });

        const { changeOrder: nextAppStatus } = result.data || {};
        setData(nextAppStatus || []);
      } finally {
        setLoading(false);
      }
    },
    [envCode, deploymentName],
  );

  useEffect(() => {
    loadData();
  }, [envCode, deploymentName]);

  return [data, loading, loadData];
}
