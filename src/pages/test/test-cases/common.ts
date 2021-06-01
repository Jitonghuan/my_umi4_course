// test case common functions
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/31 23:42

import { TreeNode } from './interfaces';

/** 广度遍历查找节点 */
export function findTreeNodeByKey(
  treeData: TreeNode[],
  key?: number,
): TreeNode | null {
  if (!key) return null;
  if (!treeData.length) return null;

  const node = treeData.find((n) => n.key === key);
  if (node) return node;

  const nextLevelList = treeData.map((n) => n.children || []).flat();

  // 遍历下一个层级
  return findTreeNodeByKey(nextLevelList, key);
}
