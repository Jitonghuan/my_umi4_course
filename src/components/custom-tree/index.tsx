// custom tree
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/20 09:51

import React, { useState, useEffect, useCallback } from 'react';
import { Tree, Input } from 'antd';
import { CustomTreeProps, TreeNode } from './interfaces';
import { searchTreeData } from './utils';
import './index.less';

export { CustomTreeProps, TreeNode };

export default function CustomTree(props: CustomTreeProps) {
  const { showSearch, treeData, searchPlaceholder = '搜索节点', keepRootInSearch = true, ...others } = props;
  const [searchValue, setSearchValue] = useState<string>();
  const [filteredTreeData, setFilteredTreeData] = useState<TreeNode[]>([]);

  const handleSearch = useCallback(
    (value: string) => {
      const [nextData, expandKeys] = searchTreeData(treeData, value);
      setFilteredTreeData(nextData);
      others?.onExpand?.(expandKeys, {} as any);
    },
    [treeData],
  );

  useEffect(() => {
    setSearchValue(undefined);
    setFilteredTreeData(treeData);
  }, [treeData]);

  if (treeData?.length === 0) {
    return null;
  }

  return (
    <div className="custom-tree-container">
      {showSearch ? (
        <div className="custom-tree-search">
          <Input.Search
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
            onSearch={handleSearch}
          />
        </div>
      ) : null}
      <Tree className="custom-tree" treeData={filteredTreeData} blockNode showIcon={false} {...others} />
    </div>
  );
}
