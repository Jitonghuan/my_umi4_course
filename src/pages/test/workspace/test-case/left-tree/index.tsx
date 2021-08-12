import React from 'react';
import { Select, Input, Tree } from 'antd';
const { DirectoryTree } = Tree;

export default function LeftTree(props: any) {
  const { caseCategories = [], caseTreeData = [], searchTreeData } = props;

  return (
    <div className="test-workspace-test-case-tree-left">
      <div className="search-header">
        <Select>{/* {caseCategories.forEach(cate=>{})} */}</Select>
        <Input />
      </div>
      <div className="tree-container">
        <DirectoryTree treeData={caseTreeData} />
      </div>
    </div>
  );
}
