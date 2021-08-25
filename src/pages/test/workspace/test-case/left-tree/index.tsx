import React, { useState, useEffect } from 'react';
import { Select, Input, Tree } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './index.less';

const { DirectoryTree } = Tree;
const { Option } = Select;

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
    expandedKeys,
    setExpandedKeys,
  } = props;
  const [keyword, setKeyword] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    void searchCateTreeData(rootCateId, keyword);
  }, [rootCateId, keyword]);

  useEffect(() => {
    void setSelectedKeys([cateTreeData[0]?.key]);
    void setCateId(cateTreeData[0]?.key);
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
        <Select
          className="case-cate-select"
          dropdownClassName="case-cate-select-dropdown"
          onChange={onCateChange}
          value={rootCateId}
        >
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
          suffix={<SearchOutlined />}
        />
      </div>
      <div className="tree-container">
        <DirectoryTree
          className="custom-tree"
          treeData={cateTreeData}
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
