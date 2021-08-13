import React, { useState, useEffect } from 'react';
import { Select, Input, Tree } from 'antd';
import { TreeNode } from '@cffe/algorithm';
const { DirectoryTree } = Tree;
const { Option } = Select;

const formatTreeData = (cateTreeData: TreeNode[]): any => {
  if (!cateTreeData) return [];
  return cateTreeData.map((node) => {
    node.bfs((node) => {
      node.title = node.name;
    });
    return node;
  });
};

export default function LeftTree(props: any) {
  const {
    caseCategories = [],
    cateTreeData = [],
    defaultCateId,
    searchCateTreeData,
    rootCateId,
    setRootCateId,
    cateId,
    setCateId,
  } = props;
  const [keyword, setKeyword] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    void searchCateTreeData(rootCateId, keyword);
  }, [rootCateId, keyword]);

  useEffect(() => {
    setExpandedKeys([cateTreeData[0]?.key]);
    setSelectedKeys([cateTreeData[0]?.key]);
    setCateId(cateTreeData[0]?.key);
  }, [cateTreeData]);

  const onCateChange = (val: any) => {
    if (!val) return;
    void setRootCateId(val);
  };

  const onKeywordChange = (e: any) => {
    void setKeyword(e.target.value);
  };

  const onSearch = () => {};

  const onExpand = (expandedKeysValue: React.Key[]) => {
    void setExpandedKeys(expandedKeysValue);
  };

  const onSelect = (selectedKeysValue: React.Key[]) => {
    void setSelectedKeys(selectedKeysValue);
    setCateId(selectedKeysValue);
  };

  return (
    <div className="test-workspace-test-case-left-tree">
      <div className="search-header">
        <Select className="case-cate-select" onChange={onCateChange} value={rootCateId}>
          {caseCategories.map((item: any) => (
            <Option key={item.id.toString()} value={item.id.toString()}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Input.Search
          className="case-cate-search"
          onChange={onKeywordChange}
          onPressEnter={onSearch}
          onSearch={onSearch}
        />
      </div>
      <div className="tree-container">
        <DirectoryTree
          className="custom-tree"
          treeData={formatTreeData(cateTreeData)}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onSelect={onSelect}
          onExpand={onExpand}
          showIcon={false}
        />
      </div>
    </div>
  );
}
