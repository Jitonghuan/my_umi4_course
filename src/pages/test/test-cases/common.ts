// test case common functions
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/31 23:42

import { SelectOptions, TreeNode } from './interfaces';

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

export const API_TYPE_OPTIONS: SelectOptions<number>[] = [
  { label: 'http', value: 0 },
  { label: 'dubbo', value: 1 },
];

export const PARAM_TYPE_OPTIONS: SelectOptions<number>[] = [
  { label: 'application/json', value: 0 },
  { label: 'form-data', value: 1 },
  { label: 'x-www-form-urlencode', value: 2 },
  { label: 'params', value: 3 },
];

export const API_METHOD_OPTIONS: SelectOptions<string>[] = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTION', value: 'OPTION' },
];
