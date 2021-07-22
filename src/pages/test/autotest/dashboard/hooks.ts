// dashboard hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/21 16:36

import { useState, useEffect } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../service';

type AnyObject = Record<string, any>;

/** 最后一次任务执行情况 */
export function useLastTaskExecution(): [AnyObject, boolean] {
  const [data, setData] = useState<AnyObject>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRequest(APIS.statisticOfLastRun)
      .then((result) => {
        setData(result.data || {});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [data, loading];
}

/** 用例数据统计 */
export function useCaseStats(): [AnyObject, AnyObject[], boolean] {
  const [overview, setOverview] = useState<AnyObject>({});
  const [data, setData] = useState<AnyObject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRequest(APIS.statisticOfCaseData)
      .then((result) => {
        setOverview(result.data?.overview || {});
        const next = [];
        const proData = result.data?.proData || {};
        for (const project in proData) {
          if (Object.prototype.hasOwnProperty.call(proData, project)) {
            const item = proData[project];
            next.push({ project, ...item });
          }
        }

        setData(next);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [overview, data, loading];
}

/** 近7天任务执行情况 */
export function useWeeklyTaskExecution(): [AnyObject, boolean] {
  const [data, setData] = useState<AnyObject>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRequest(APIS.statisticOfNearly7Days)
      .then((result) => {
        setData(result.data || {});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [data, loading];
}

/** 近一个月用例新增情况 */
export function useMonthlyCaseIncrement(): [AnyObject[], boolean] {
  const [data, setData] = useState<AnyObject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRequest(APIS.statisticOfNewCase)
      .then((result) => {
        const next = [];
        const map = result.data || {};
        for (const date in map) {
          if (Object.prototype.hasOwnProperty.call(map, date)) {
            const count = map[date];
            next.push({ date, count });
          }
        }

        setData(next);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [data, loading];
}
