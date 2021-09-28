import { useState, useEffect, useCallback, useRef } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from './service';

let projectTreeDataCatchWH = false;
let projectTreeDataCatch: any;
export function useProjectTreeData() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    if (projectTreeDataCatchWH) return;
    projectTreeDataCatchWH = true;
    getRequest(APIS.getProjectTreeData).then((res) => {
      const Q = [...res.data];
      while (Q.length) {
        const cur = Q.shift();
        cur.label = cur.name;
        cur.value = cur.id;
        cur.children && Q.push(...cur.children);
      }
      projectTreeDataCatch = res.data;
    });
  }, []);

  useEffect(() => {
    setData(projectTreeDataCatch);
  }, [projectTreeDataCatch]);

  return [data];
}

export function useAllTestCaseTree() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    getRequest(APIS.getAllTestCaseTree).then((res) => {
      setData(res.data);
    });
  }, []);

  return [data];
}

let userListWH = false;
let userList: any;
export function useUserOptions() {
  const [data, setData] = useState<IOption[]>([]);

  useEffect(() => {
    if (userListWH) return;
    userListWH = true;
    getRequest(APIS.getUsers).then((res) => {
      userList = res.data;
    });
  }, []);

  useEffect(() => {
    setData(userList);
  }, [userList]);

  return [data];
}

export function useSelectedCaseTree(phaseId: string | number) {
  const [data, setData] = useState<any[]>([]);
  const [nodeMap, setNodeMap] = useState<Record<React.Key, any>>({});
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (!phaseId?.toString()) return;
    getRequest(APIS.getSelectedCaseTree, { data: { phaseId } }).then((res) => {
      setData(res.data);

      const _checkedKeys: React.Key[] = [];
      const _expandedKeys: React.Key[] = [];
      const _nodeMap: any = {};

      // const dfs = (node: any): boolean => {
      //   _nodeMap[node.id] = node;
      //   if (node.isLeaf) {
      //     if (node.checked) {
      //       _checkedKeys.push(node.key);
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   }
      //   _expandedKeys.push(node.key);

      //   for (const subNode of node.children) {
      //     if (!dfs(subNode)) _expandedKeys.pop();
      //   }
      // };

      const Q: any[] = [...res.data];
      while (Q.length) {
        const cur = Q.shift();
        _nodeMap[cur.id] = cur;
        if (cur.checked) _checkedKeys.push(cur.key);
        cur.children && Q.push(...cur.children);
      }
      setNodeMap(_nodeMap);
    });
  }, [phaseId]);

  const querySubNode = (cateId: number | string) => {
    if (nodeMap[cateId]) return;
  };

  return [data, checkedKeys, expandedKeys, querySubNode];
}
