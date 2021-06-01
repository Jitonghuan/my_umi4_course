// test case hooks
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/31 17:15

import { useState, useEffect } from 'react';
import * as APIS from './service';
import { getRequest } from '@/utils/request';
import { SelectOptions, TreeNode } from './interfaces';

const mockTreeData = [
  {
    id: 1,
    name: '医共体CIS',
    children: [
      {
        id: 11,
        name: '医生工作站',
        children: [
          {
            id: 1101,
            name: 'getPatientList',
          },
          {
            id: 1102,
            name: 'getOrderList',
          },
        ],
      },
      {
        id: 20,
        name: '护士站',
        children: [
          {
            id: 2001,
            name: 'getPatientDetail',
          },
        ],
      },
    ],
  },
];

export function useProjectOptions(
  key = 1,
): [
  SelectOptions<number>[],
  React.Dispatch<React.SetStateAction<SelectOptions<number>[]>>,
] {
  const [data, setData] = useState<SelectOptions<number>[]>([]);

  useEffect(() => {
    getRequest(APIS.getProjects).then((result) => {
      const list = (result.data || []).map((n: any) => ({
        label: `${n.name} (${n.id})`,
        value: n.id,
      }));

      setData(list);
    });
  }, [key]);

  return [data, setData];
}

export function useLeftTreeData(
  projectId?: number,
  key = 1,
): [TreeNode[], boolean] {
  const [data, setData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    // setData([]);
    getRequest(APIS.getApiTree, {
      data: { id: projectId },
    })
      .then((result) => {
        // 第一层是项目
        const list = formatTreeData(result.data || []);
        setData(list);
      })
      .catch(() => {
        setData(formatTreeData(mockTreeData));
        // XXX setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId, key]);

  return [data, loading];
}

function formatTreeData(payload: any) {
  if (!payload?.length) return [];

  return payload.map((n1: any) => ({
    key: n1.id,
    title: n1.name, // 项目名
    selectable: false,
    level: 1, // 加上 level 方便判断
    // 第二层是模块
    children: (n1.children || []).map((n2: any) => ({
      key: n2.id,
      title: n2.name, // 模块名
      selectable: false,
      level: 2,
      // 第三层是接口
      children: (n2.children || []).map((n3: any) => ({
        key: n3.id,
        title: n3.name, // 接口名
        selectable: true,
        isLeaf: true,
        level: 3,
      })),
    })),
  }));
}
