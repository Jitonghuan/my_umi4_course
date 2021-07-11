// hooks for report detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/11 14:29

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from '../../service';

// const sleep = (x: number) => new Promise(resolve => setTimeout(resolve, x));

export function useReportTreeData(recordId: number): [any, boolean] {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!recordId) return;

    setLoading(true);
    try {
      // await sleep(3000);
      const result = await getRequest(APIS.getReportTree, {
        data: { recordId },
      });

      setData(result.data || {});
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    loadData();
  }, [recordId]);

  return [data, loading];
}

export function useReportDetailData(
  recordId: number,
  projectId: number,
  moduleId: number,
  belongId: number,
  caseId: number,
): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!recordId || !projectId || !moduleId || !belongId || !caseId) return;

    try {
      const result = await getRequest(APIS.getReportDetail, {
        data: {
          recordId,
          projectId,
          moduleId,
          belongId,
          id: caseId,
        },
      });

      setData(result.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [recordId, projectId, moduleId, belongId, caseId]);

  return [data, loading];
}
