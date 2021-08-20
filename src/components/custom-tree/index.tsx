// custom tree
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/20 09:51

import React, { useMemo, useState, useEffect } from 'react';
import { Tree, Input } from 'antd';
import { CustomTreeProps, TreeNode } from './interfaces';
import './index.less';

export { CustomTreeProps, TreeNode };

export default function CustomTree(props: CustomTreeProps) {
  const { showSearch, treeData, searchPlaceholder = '搜索节点', keepRootInSearch = true, ...others } = props;
  const [searchValue, setSearchValue] = useState<string>();
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    setSearchValue(undefined);
  }, [treeData]);

  const filteredTreeData: TreeNode[] = useMemo(() => {
    if (!searchKey) return treeData;

    return [];
    // return treeData;
  }, [treeData, searchKey]);

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
            onSearch={(v) => setSearchKey(v)}
          />
        </div>
      ) : null}
      <Tree className="custom-tree" treeData={filteredTreeData} blockNode showIcon={false} {...others} />
    </div>
  );
}
