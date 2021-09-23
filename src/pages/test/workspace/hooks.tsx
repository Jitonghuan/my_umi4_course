import { useState, useEffect, useCallback, useRef } from 'react';
import { getRequest } from '@/utils/request';
import * as APIS from './service';
import { Options } from '_ahooks@2.10.9@ahooks/lib/useCountDown';

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
