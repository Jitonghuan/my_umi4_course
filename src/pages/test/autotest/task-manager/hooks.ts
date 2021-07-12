// task manager hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/06 20:15

import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';
import { TaskItemVO, TaskReportItemVO } from '../interfaces';

export function useTaskList(
  keyword: string,
  pageIndex = 1,
  pageSize = 20,
): [TaskItemVO[], number, boolean, () => Promise<void>] {
  const [data, setData] = useState<TaskItemVO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRequest(APIS.getTaskList, {
        data: { keyword, pageIndex, pageSize },
      });

      const { dataSource, pageInfo } = result.data || {};
      setData(dataSource || []);
      setTotal(pageInfo?.total || 0);
    } catch (ex) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, pageIndex, pageSize]);

  useEffect(() => {
    loadData();
  }, [keyword, pageIndex, pageSize]);

  return [data, total, loading, loadData];
}

export function useReportList(
  taskId: number,
  pageIndex = 1,
  pageSize = 20,
): [TaskReportItemVO[], number, boolean, () => Promise<void>] {
  const [data, setData] = useState<TaskReportItemVO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!taskId) return;

    setLoading(true);

    try {
      const result = await getRequest(APIS.getRecordList, {
        data: { taskId, pageIndex, pageSize },
      });

      const { dataSource, pageInfo } = result.data || {};
      setData(dataSource || []);
      setTotal(pageInfo?.total || 0);
    } catch (ex) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [taskId, pageIndex, pageSize]);

  useEffect(() => {
    loadData();
  }, [taskId, pageIndex, pageSize]);

  return [data, total, loading, loadData];
}
