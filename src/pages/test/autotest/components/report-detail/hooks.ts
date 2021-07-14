// hooks for report detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/11 14:29

import { useState, useEffect, useCallback } from 'react';
import { getRequest } from '@/utils/request';
import { TreeNode } from '../../interfaces';
import { treeDataFormatter } from './formatter';
import * as APIS from '../../service';

export function useReportTreeData(recordId: number): [any, TreeNode[], boolean] {
  const [data, setData] = useState<any>({});
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!recordId) return;

    setLoading(true);
    try {
      const result = await getRequest(APIS.getReportTree, {
        data: { recordId },
      });

      setData(result.data || {});
      setTree(treeDataFormatter(result.data?.report_tree || []));
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    loadData();
  }, [recordId]);

  return [data, tree, loading];
}

export function useReportDetailData(recordId?: number, selectedNode?: TreeNode): [any[], boolean] {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!recordId || !selectedNode) return;

    setLoading(true);
    try {
      const result = await getRequest(APIS.getReportDetail, {
        data: {
          recordId,
          projectId: selectedNode.parent?.parent?.parent?.bizId,
          moduleId: selectedNode.parent?.parent?.bizId,
          belongId: selectedNode.parent?.bizId,
          id: selectedNode.bizId,
        },
      });

      setData(result.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [recordId, selectedNode]);

  return [data, loading];
}
