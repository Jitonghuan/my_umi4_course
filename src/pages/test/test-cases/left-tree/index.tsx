// test case list
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 16:29

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Form, Input, Select, Tree, message } from 'antd';
import {
  PlusSquareFilled,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons';
import VCCustomIcon from '@cffe/vc-custom-icon';
import type Emitter from 'events';
import FELayout from '@cffe/vc-layout';
import { CardRowGroup } from '@/components/vc-page-content';
import * as APIS from '../service';
import { getRequest, postRequest } from '@/utils/request';
import { SelectOptions, CaseItemVO } from '../interfaces';
import { useProjectOptions } from '../hooks';
import './index.less';

export interface LeftTreeProps extends Record<string, any> {
  emitter: Emitter;
  onItemClick: (item: CaseItemVO) => any;
}

const stopPropagation = {
  onClick: (e: any) => e && e.stopPropagation(),
};

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    selectable: false,
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        selectable: false,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            isLeaf: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
            isLeaf: true,
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        selectable: false,
        children: [
          {
            title: <span style={{ color: '#1890ff' }}>sss</span>,
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];

export default function LeftTree(props: LeftTreeProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [projectOptions] = useProjectOptions();
  const [searchProject, setSearchProject] = useState<number>();
  const [searchKey, setSearchKey] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<CaseItemVO>();

  const handleSearch = useCallback(() => {
    // ...
  }, [searchKey]);

  const handleAddProject = useCallback(() => {}, []);

  const handleItemSelect = (nextKeys: React.Key[], info: any) => {
    if (!nextKeys.length) return; // 禁止反选

    const item: CaseItemVO = info.selectedNodes[0];
    console.log('>> selected', item);
    setSelectedItem(item);
  };

  return (
    <CardRowGroup.SlideCard width={244} className="page-case-list">
      <div className="case-list-header">
        {/* <Input
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onPressEnter={handleSearch}
          placeholder="搜索"
        /> */}
        <Select
          options={projectOptions}
          value={searchProject}
          onChange={(v) => setSearchProject(v)}
          placeholder="项目"
        />
        <a onClick={handleAddProject}>
          <PlusSquareFilled style={{ fontSize: 24 }} />
        </a>
      </div>

      <Tree.DirectoryTree
        treeData={treeData}
        selectedKeys={selectedItem ? [selectedItem.key] : []}
        onSelect={handleItemSelect}
        showIcon={false}
        titleRender={(nodeData) => (
          <div className="custom-tree-node">
            <span>{nodeData.title}</span>
            {!nodeData.isLeaf ? (
              <a {...stopPropagation}>
                <EditOutlined />
              </a>
            ) : null}
            {!nodeData.isLeaf ? (
              <a {...stopPropagation}>
                <PlusOutlined />
              </a>
            ) : null}
            <a {...stopPropagation}>
              <VCCustomIcon type="icondelete" />
            </a>
          </div>
        )}
      />
    </CardRowGroup.SlideCard>
  );
}
