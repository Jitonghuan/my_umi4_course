// custom tree
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/20 09:51

import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Tree, Input, Select } from 'antd';
import { CustomTreeProps, TreeNode } from './interfaces';
import { searchTreeData } from './utils';
import './index.less';

export { CustomTreeProps, TreeNode };

export default function CustomTree(props: CustomTreeProps) {
  const {
    showSearch,
    className,
    treeData,
    searchPlaceholder = '搜索节点',
    keepRootInSearch = true,
    showSideSelect = false,
    onSideSelectChange,
    sideSelectPlaceholder = '请选择',
    sideSelectOptions,
    ...others
  } = props;
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

  const clazz = classNames('custom-tree', className);

  return (
    <div className="custom-tree-container">
      <div className="custom-tree-header">
        {showSideSelect ? (
          <Select
            className="custom-tree-header-side-select"
            options={sideSelectOptions || []}
            placeholder={sideSelectPlaceholder}
            onChange={(val) => {
              onSideSelectChange && val && onSideSelectChange(val.toString());
            }}
          />
        ) : null}
        {showSearch ? (
          <div className="custom-tree-header-search">
            <Input.Search
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholder}
              onSearch={handleSearch}
            />
          </div>
        ) : null}
      </div>
      <Tree className={clazz} treeData={filteredTreeData} blockNode showIcon={false} {...others} />
    </div>
  );
}
