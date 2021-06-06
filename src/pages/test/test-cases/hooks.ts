// test case hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/31 17:15

import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import { SelectOptions, TreeNode, ProjectItemVO } from './interfaces';
import { formatTreeData } from './common';

// 当前可选的项目列表
export function useProjectOptions(): [
  SelectOptions<number, ProjectItemVO>[],
  React.Dispatch<React.SetStateAction<SelectOptions<number, ProjectItemVO>[]>>,
  () => void,
] {
  const [data, setData] = useState<SelectOptions<number, ProjectItemVO>[]>([]);

  const loadData = useCallback(() => {
    getRequest(APIS.getProjects).then((result) => {
      const list = (result.data || []).map((n: any) => ({
        label: n.name,
        value: n.id,
        data: n,
      }));

      setData(list);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return [data, setData, loadData];
}

// 获取左侧树结构数据
export function useLeftTreeData(
  projectId?: number,
): [
  TreeNode[],
  boolean,
  React.Dispatch<React.SetStateAction<TreeNode[]>>,
  () => Promise<void>,
] {
  const [data, setData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    // setData([]); // 这里不能清空数据，否则会触发联动判断!!

    try {
      const result = await getRequest(APIS.getApiTree, {
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

// 获取 API 详情
export function useApiDetail(id: number): [Record<string, any>, boolean] {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setData({});
    getRequest(APIS.getApiInfo, {
      data: { id },
    })
      .then((result) => {
        setData(result.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return [data, loading];
}

// 获取用例列表
export function useCaseList(
  id: number,
  pageIndex: number,
): [Record<string, any>[], number, boolean, (page?: number) => Promise<void>] {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = async (page = pageIndex) => {
    if (!id) return;

    setData([]);
    setLoading(true);

    getRequest(APIS.getCaseList, {
      data: { id, type: 2, page, pageSize: 20 },
    })
      .then((result) => {
        const { dataSource, pageInfo } = result.data || {};

        setData(dataSource || []);
        setTotal(pageInfo?.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [id, pageIndex]);

  return [data, total, loading, loadData];
}
