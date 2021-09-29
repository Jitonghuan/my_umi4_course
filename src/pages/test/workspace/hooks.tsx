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

export function useSelectedCaseTree(phaseId?: string): [any[], React.Key[], React.Key[], (cateId: React.Key) => void] {
  const [data, setData] = useState<any[]>([]);
  const [nodeMap, setNodeMap] = useState<Record<React.Key, any>>({});
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    setData([]);
    if (phaseId) {
      getRequest(APIS.getSelectedCaseTree, { data: { phaseId } }).then((res) => {
        setData(res.data);

        const _checkedKeys: React.Key[] = [];
        const _expandedKeys: React.Key[] = [];
        const _nodeMap: Record<React.Key, any> = {};

        const dfs = (node: any): boolean => {
          _nodeMap[node.id] = node;
          if (node.isLeaf) {
            if (node.checked) {
              _checkedKeys.push(node.key);
              return true;
            } else {
              return false;
            }
          }
          if (!node.children) {
            return false;
          }
          _expandedKeys.push(node.key);
          let flag = false;
          for (const subNode of node.children) {
            if (dfs(subNode)) flag = true;
          }
          if (!flag) _expandedKeys.pop();
          return flag;
        };

        dfs({ children: res.data });
        setCheckedKeys(_checkedKeys);
        setExpandedKeys(_expandedKeys);
        setNodeMap(_nodeMap);
      });
    }
  }, [phaseId]);

  const querySubNode = async (cateId: React.Key) => {
    if (nodeMap[cateId].children) return;
    const res = await getRequest(APIS.getCaseMultiDeepList, {
      data: {
        categoryId: cateId,
        deep: 1,
      },
    });

    const _nodeMap: Record<React.Key, any> = nodeMap;
    const _data: any[] = data;
    _nodeMap[cateId].children = res.data.map((item: any) => ({ ...item, children: undefined }));
    _nodeMap[cateId].children.forEach((node: any) => {
      if (!node.isLeaf) _nodeMap[node.id] = node;
    });
    setData(new Array(..._data));
    setNodeMap({ ..._nodeMap });
  };

  return [data, checkedKeys, expandedKeys, querySubNode];
}

export function useBugAssociatedCaseTree(
  bugId: React.Key,
): [any[], React.Key[], React.Key[], (cateId: React.Key) => void] {
  const [data, setData] = useState<any[]>([]);
  const [nodeMap, setNodeMap] = useState<Record<React.Key, any>>({});
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    setData([]);
    if (bugId) {
      getRequest(APIS.getBugAssociatedCaseTree, { data: { bugId } }).then((res) => {
        setData(res.data);

        const _checkedKeys: React.Key[] = [];
        const _expandedKeys: React.Key[] = [];
        const _nodeMap: Record<React.Key, any> = {};

        const dfs = (node: any): boolean => {
          _nodeMap[node.id] = node;
          if (node.isLeaf) {
            if (node.checked) {
              _checkedKeys.push(node.key);
              return true;
            } else {
              return false;
            }
          }
          if (!node.children) {
            return false;
          }
          _expandedKeys.push(node.key);
          let flag = false;
          for (const subNode of node.children) {
            if (dfs(subNode)) flag = true;
          }
          if (!flag) _expandedKeys.pop();
          return flag;
        };

        dfs({ children: res.data });
        setCheckedKeys(_checkedKeys);
        setExpandedKeys(_expandedKeys);
        setNodeMap(_nodeMap);
      });
    }
  }, [bugId]);

  const querySubNode = async (cateId: React.Key) => {
    if (nodeMap[cateId].children) return;
    const res = await getRequest(APIS.getCaseMultiDeepList, {
      data: {
        categoryId: cateId,
        deep: 1,
      },
    });

    const _nodeMap: Record<React.Key, any> = nodeMap;
    const _data: any[] = data;
    _nodeMap[cateId].children = res.data.map((item: any) => ({ ...item, children: undefined }));
    _nodeMap[cateId].children.forEach((node: any) => {
      if (!node.isLeaf) _nodeMap[node.id] = node;
    });
    setData(new Array(..._data));
    setNodeMap({ ..._nodeMap });
  };

  return [data, checkedKeys, expandedKeys, querySubNode]; //
}

export function useBug(id: React.Key) {
  const [data, setData] = useState<any>();

  const loadData = useCallback(() => {
    if (id === undefined) {
      setData(undefined);
      return;
    }
    getRequest(APIS.getBug, { data: { id } }).then((res) => {
      setData(res.data);
    });
  }, [id]);

  return [data, loadData];
}
