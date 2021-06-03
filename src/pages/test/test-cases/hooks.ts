// test case hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/31 17:15

import { useState, useEffect, useCallback } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import { SelectOptions, TreeNode, ProjectItemVO } from './interfaces';

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

function formatTreeData(payload: any) {
  if (!payload?.length) return [];

  // 第一层是项目，目前有且仅有一个
  return payload.map((n1: any) => ({
    key: n1.id,
    title: n1.name, // 项目名
    desc: n1.desc,
    selectable: false,
    level: 1, // 加上 level 方便判断
    // 第二层是模块
    children: (n1.children || []).map((n2: any) => ({
      key: n2.id,
      title: n2.name, // 模块名
      desc: n2.desc,
      selectable: false,
      level: 2,
      projectId: n1.id,
      // 第三层是接口
      children: (n2.children || []).map((n3: any) => ({
        key: n3.id,
        title: n3.name, // 接口名
        selectable: true,
        isLeaf: true,
        level: 3,
        projectId: n1.id,
        moduleId: n2.id,
      })),
    })),
  }));
}
