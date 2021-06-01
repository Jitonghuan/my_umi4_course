// test case list
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 16:29

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Modal, Form, Input, Select, Tree, Spin, Empty, message } from 'antd';
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
import { TreeNode } from '../interfaces';
import { useProjectOptions, useLeftTreeData } from '../hooks';
import { findTreeNodeByKey } from '../common';
import './index.less';

export interface LeftTreeProps extends Record<string, any> {
  emitter: Emitter;
  onItemClick: (item?: TreeNode) => any;
}

const stopProp = {
  onClick: (e: any) => e && e.stopPropagation(),
};

type nodeAction =
  | 'editProject'
  | 'delProject'
  | 'addModule'
  | 'editModule'
  | 'delModule'
  | 'addApi'
  | 'editApi'
  | 'delApi';

export default function LeftTree(props: LeftTreeProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [projectOptions, setProjectOptions] = useProjectOptions();
  const [searchProject, setSearchProject] = useState<number>();
  const [treeData, treeLoading] = useLeftTreeData(searchProject);
  // const [searchKey, setSearchKey] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<TreeNode>();

  useEffect(() => {
    if (!projectOptions?.length) {
      setSearchProject(undefined);
      return;
    }
    // 默认选中第 0 个项目，触发 treeData 更新
    if (
      !searchProject ||
      !projectOptions.find((n) => n.value === searchProject)
    ) {
      setSearchProject(projectOptions[0].value);
    }
  }, [projectOptions, searchProject]);

  // treeData 变更时重置选中状态
  useEffect(() => {
    if (!selectedItem) return;

    if (!treeData.length) {
      setSelectedItem(undefined);
      props.onItemClick(undefined);
      return;
    }

    // 新的 treeData 中未找到当前节点，则也重置
    const target = findTreeNodeByKey(treeData, selectedItem.key);
    if (!target) {
      setSelectedItem(undefined);
      props.onItemClick(undefined);
    }
  }, [treeData]);

  const handleItemSelect = (nextKeys: React.Key[], info: any) => {
    if (!nextKeys.length) return; // 禁止反选

    const item: TreeNode = info.selectedNodes[0];
    if (item === selectedItem) return; // 防止重复点击

    console.log('>> selected', item);
    setSelectedItem(item);
    props.onItemClick(item);
  };

  // 添加项目
  const handleAddProject = useCallback(() => {}, []);

  // 节点上的各种操作
  const handleNodeAction = useCallback(
    (action: nodeAction, node: TreeNode) => {
      switch (action) {
        case 'delProject': {
          Modal.confirm({
            title: '操作确认',
            content: `确定删除项目 ${node.title} ？删除后相关数据将自动清除`,
            onOk: () => {
              // TODO 调用接口
              const nextProjectList = projectOptions?.slice(0) || [];
              const index = nextProjectList.findIndex(
                (n) => n.value === searchProject,
              );
              index > -1 && nextProjectList?.splice(index, 1);
              setProjectOptions(nextProjectList);
            },
          });

          break;
        }
        default:
          break;
      }
    },
    [treeData],
  );

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
        <a onClick={handleAddProject} title="添加项目">
          <PlusSquareFilled style={{ fontSize: 24 }} />
        </a>
      </div>

      {treeLoading && !treeData.length ? (
        <div className="spin-wrapper">
          <Spin />
        </div>
      ) : null}
      {!treeLoading && !treeData.length ? (
        <Empty
          description="未找到数据"
          style={{ marginTop: 60 }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : null}

      <Tree.DirectoryTree
        key={searchProject || 1}
        treeData={treeData}
        selectedKeys={selectedItem ? [selectedItem.key] : []}
        onSelect={handleItemSelect}
        showIcon={false}
        titleRender={(nodeData: TreeNode) => (
          <div className="custom-tree-node">
            <span>{nodeData.title}</span>
            {/* 编辑项目 */}
            {nodeData.level === 1 && (
              <a title="编辑项目" {...stopProp}>
                <EditOutlined
                  onClick={() => handleNodeAction('editProject', nodeData)}
                />
              </a>
            )}
            {/* 添加子节点：模块 */}
            {nodeData.level === 1 && (
              <a title="添加子节点：模块" {...stopProp}>
                <PlusOutlined
                  onClick={() => handleNodeAction('addModule', nodeData)}
                />
              </a>
            )}
            {/* 删除项目 */}
            {nodeData.level === 1 && (
              <a title="删除项目" {...stopProp}>
                <VCCustomIcon
                  onClick={() => handleNodeAction('delProject', nodeData)}
                  type="icondelete"
                />
              </a>
            )}

            {/* 编辑模块 */}
            {nodeData.level === 2 && (
              <a title="编辑模块" {...stopProp}>
                <EditOutlined
                  onClick={() => handleNodeAction('editModule', nodeData)}
                />
              </a>
            )}
            {/* 添加子节点：接口 */}
            {nodeData.level === 2 && (
              <a title="添加子节点：接口" {...stopProp}>
                <PlusOutlined
                  onClick={() => handleNodeAction('addApi', nodeData)}
                />
              </a>
            )}
            {/* 删除模块 */}
            {nodeData.level === 2 && (
              <a title="删除模块" {...stopProp}>
                <VCCustomIcon
                  onClick={() => handleNodeAction('delModule', nodeData)}
                  type="icondelete"
                />
              </a>
            )}

            {/* 编辑接口 */}
            {nodeData.level === 3 && (
              <a title="编辑接口" {...stopProp}>
                <EditOutlined
                  onClick={() => handleNodeAction('editApi', nodeData)}
                />
              </a>
            )}
            {/* 删除接口 */}
            {nodeData.level === 3 && (
              <a title="删除接口" {...stopProp}>
                <VCCustomIcon
                  onClick={() => handleNodeAction('delApi', nodeData)}
                  type="icondelete"
                />
              </a>
            )}
          </div>
        )}
      />
    </CardRowGroup.SlideCard>
  );
}
