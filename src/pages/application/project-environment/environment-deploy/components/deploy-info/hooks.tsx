// deploy info hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/18 09:48

import { useState, useEffect, useCallback } from 'react';
import { IStatusInfoProps } from '@/pages/application/application-detail/types';
import { getRequest } from '@/utils/request';
import * as APIS from '@/pages/application/service';

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
      if (envCode === 'zy-prd' || envCode === 'ws-prd' || envCode === 'zy-daily') {
        try {
          const result = await getRequest(APIS.queryApplicationStatus, {
            data: { deploymentName, envCode },
          });

          const { Status: nextAppStatus } = result.data || {};
          setData(nextAppStatus || []);
        } finally {
          setLoading(false);
        }
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
