// scene hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 15:57

import { useState, useEffect, useCallback } from 'react';
import * as APIS from '../service';
import { getRequest } from '@/utils/request';
import { TreeNode, SceneItemVO, CaseItemVO } from '../interfaces';
import { formatTreeData } from '../common';

// 获取左侧树结构数据
export function useLeftTreeData(
  projectId?: number,
): [TreeNode[], boolean, React.Dispatch<React.SetStateAction<TreeNode[]>>, () => Promise<void>] {
  const [data, setData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    // setData([]); // 这里不能清空数据，否则会触发联动判断!!

    try {
      const result = await getRequest(APIS.getSceneTree, {
        data: { id: projectId },
      });
      const list = formatTreeData(result.data || []);
      setData(list);
    } catch (ex) {
      // 如果失败了，则清空值
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [projectId]);

  return [data, loading, setData, loadData];
}

// 根据项目/模块 获取场景列表
export function useSceneList(
  nodeId: number,
  nodeType = 0,
  pageIndex = 1,
  pageSize = 20,
): [SceneItemVO[], number, boolean, React.Dispatch<React.SetStateAction<SceneItemVO[]>>, () => Promise<void>] {
  const [data, setData] = useState<SceneItemVO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!nodeId) return;

    setLoading(true);
    try {
      const result = await getRequest(APIS.getSceneList, {
        data: { id: nodeId, type: nodeType, pageIndex, pageSize },
      });

      const { dataSource, pageInfo } = result.data || {};
      setData(dataSource || []);
      setTotal(pageInfo?.total ?? dataSource?.length ?? 0);
    } catch (ex) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [nodeId, nodeType, pageIndex, pageSize]);

  useEffect(() => {
    loadData();
  }, [nodeId, nodeType, pageIndex, pageSize]);

  return [data, total, loading, setData, loadData];
}
