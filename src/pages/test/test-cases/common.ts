// test case common functions
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/31 23:42

import { SelectOptions, TreeNode } from './interfaces';

export const API_TYPE = {
  HTTP: 0,
  DUBBO: 1,
  _default: 0,
};

export const PARAM_TYPE = {
  FORM_DATA: 1,
  FORM_URLENCODE: 2,
  PARAMS: 3,
  JSON: 0,
  _default: 1,
};

export const API_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTION: 'OPTION',
  _default: 'GET',
};

export const API_TYPE_OPTIONS: SelectOptions<number>[] = [
  { label: 'http', value: 0 },
  { label: 'dubbo', value: 1 },
];

export const PARAM_TYPE_OPTIONS: SelectOptions<number>[] = [
  { label: 'form-data', value: 1 },
  { label: 'x-www-form-urlencode', value: 2 },
  { label: 'params', value: 3 },
  { label: 'application/json', value: 0 },
];

export const API_METHOD_OPTIONS: SelectOptions<string>[] = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTION', value: 'OPTION' },
];

/** 广度遍历查找节点 */
export function findTreeNodeByKey(
  treeData: TreeNode[],
  key?: number | string,
): TreeNode | null {
  if (!key) return null;
  if (!treeData.length) return null;

  const node = treeData.find((n) => n.key === key);
  if (node) return node;

  const nextLevelList = treeData.map((n) => n.children || []).flat();

  // 遍历下一个层级
  return findTreeNodeByKey(nextLevelList, key);
}
/** 返回合并后的数组 */
export function getMergedList<T, U>(
  list: T[],
  addon: U,
  callback: (item: T, addon: U) => boolean,
) {
  if (!list.length) return [];

  const next = list.slice(0);
  const index = next.findIndex((n) => callback(n, addon));

  if (index > -1) {
    next[index] = {
      ...next[index],
      ...addon,
    };
  }

  return next;
}

export function formatTreeData(payload: any) {
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
