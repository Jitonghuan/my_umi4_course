// custom tree utils
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/20 10:45

import { TreeNode } from './interfaces';

function filterTree(treeData: TreeNode[], callback: (node: TreeNode) => boolean): TreeNode[] {
  const next: TreeNode[] = [];
  treeData.forEach((node) => {
    if (callback(node) === true) {
      return next.push(node);
    }
    if (!node.children?.length) return;

    const subList = filterTree(node.children, callback);
    if (!subList.length) return;

    next.push({
      ...node,
      children: subList,
    });
  });

  return next;
}

function getParentKeys(treeData: TreeNode[], callback: (node: TreeNode) => void): void {
  const stack: TreeNode[] = [...treeData];

  let next: TreeNode | undefined;
  while (!!(next = stack.shift())) {
    if (next.children?.length) {
      callback(next);
    }
    stack.push(...(next.children || []));
  }
}

export function searchTreeData(treeData: TreeNode[], keyword?: string): [TreeNode[], (number | string)[]] {
  if (!keyword) {
    return [treeData, [treeData[0]?.key]];
  }

  const fitleredList = filterTree(treeData, (node) => {
    return `${node.key}` === keyword || !!node.title?.includes(keyword);
  });

  const expandKeys: React.Key[] = [];
  getParentKeys(fitleredList, (node) => expandKeys.push(node.key));

  return [fitleredList, expandKeys];
}
