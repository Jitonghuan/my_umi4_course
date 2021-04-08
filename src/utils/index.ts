/** 深度优先搜索处理 func */
export const DFSFunc = (
  tree: any[],
  childKey: string = 'children',
  func: (treeNode: any) => void,
) => {
  tree.forEach((node) => {
    if (node[childKey]) {
      DFSFunc(node[childKey], childKey, func);
    }

    func(node);
  });
};
