import { useState } from 'react';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from '../service';

//查询概览信息
export function useQueryOverviewDashboards(): [boolean, any, () => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const getOverviewDashboards = async () => {
    setLoading(true);
    await getRequest(`${APIS.getOverviewDashboards}`)
      .then((result) => {
        if (result.success) {
          setData(
            result?.data || {
              sumCloud: 0,
              sumLocal: 0,
              sumMongdb: 0,
              sumMysql: 0,
              sumOperator: 0,
              sumPostgre: 0,
              sumRds: 0,
              sumRedis: 0,
            },
          );
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getOverviewDashboards];
}

//实例概览列表
export function useQueryOverviewInstances(): [boolean, any, (paramsObj: { instanceType: number }) => Promise<void>] {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const getOverviewInstances = async (paramsObj: { instanceType: number }) => {
    setLoading(true);
    await getRequest(`${APIS.getOverviewInstances}`, { data: { ...paramsObj } })
      .then((result) => {
        if (result?.success) {
          setData(result?.data);
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return [loading, data, getOverviewInstances];
}

/** 实例性能趋势 */
export const queryPerformanceTrends = (paramsObj: { instanceId: number; start: string; end: string }) => {
  return postRequest(APIS.getPerformanceTrends, {
    data: paramsObj,
  }).then((res: any) => {
    if (res?.success) {
      const dataSource = res.data || [];
      const connections = dataSource?.connections || [];
      const cpuLimit = dataSource?.cpuLimit || [];
      const cpuUse = dataSource?.cpuUse || [];
      const diskReads = dataSource?.diskReads || [];

      const diskWrites = dataSource?.diskWrites || [];

      const memLimitInfo = dataSource?.memLimitInfo || [];
      const qps = dataSource?.qps || [];
      const receive = dataSource?.receive || [];
      const rowsOps = dataSource?.rowsOps || [];
      const rssInfo = dataSource?.rssInfo || [];
      const tps = dataSource?.tps || [];
      //"transmit": null,
      // "wssInfo": null
      const transmit = dataSource?.transmit || [];

      const wssInfo = dataSource?.wssInfo || [];

      return dataSource;
    }
    return {};
  });
};
