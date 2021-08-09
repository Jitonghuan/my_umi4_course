// test case list
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 16:29

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Select, Tree, Spin, Empty, message } from 'antd';
import { PlusOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons';
import type Emitter from 'events';
import VCCustomIcon from '@cffe/vc-custom-icon';
import { CardRowGroup } from '@/components/vc-page-content';
import * as APIS from '../../service';
import { postRequest } from '@/utils/request';
import { TreeNode, EditorMode } from '../../interfaces';
import { useLeftTreeData } from '../hooks';
import { findTreeNodeByKey } from '../../common';
import { useProjectOptions } from '../../hooks';
import SceneEditor from '../../_components/scene-editor';
import SceneClone from '../../_components/scene-clone';
import './index.less';

export interface LeftTreeProps extends Record<string, any> {
  emitter: Emitter;
  onItemClick: (item?: TreeNode) => any;
}

const stopProp = {
  onClick: (e: any) => e && e.stopPropagation(),
};

type nodeAction = 'addScene' | 'editScene' | 'delScene' | 'cloneScene';

export default function LeftTree(props: LeftTreeProps) {
  const [projectOptions] = useProjectOptions();
  const [searchProject, setSearchProject] = useState<number>();
  const [treeData, treeLoading, setTreeData, reloadTreeData] = useLeftTreeData(searchProject);
  const [selectedItem, setSelectedItem] = useState<TreeNode>();
  // 当前操作的节点（或者触发节点）
  const targetNodeRef = useRef<TreeNode>();
  const [sceneEditorMode, setSceneEditorMode] = useState<EditorMode>('HIDE');
  const [expandedKeys, setExpandedKeys] = useState<(number | string)[]>([]);

  // 复制场景
  const [cloneTargetNode, setCloneTargetNode] = useState<TreeNode>();

  // ----- hooks
  // projectOptions 变更后重新判断选中状态
  useEffect(() => {
    if (!projectOptions?.length) {
      setSearchProject(undefined);
      return;
    }
    // 默认选中第 0 个项目，触发 treeData 更新
    if (!searchProject || !projectOptions.find((n) => n.value === searchProject)) {
      setSearchProject(projectOptions[0].value);
    }
  }, [projectOptions, searchProject]);

  // treeData 变更时重置选中状态
  useEffect(() => {
    if (!treeData.length && selectedItem) {
      setSelectedItem(undefined);
      props.onItemClick(undefined);
      return;
    }

    // 新的 treeData 中未找到当前节点，则也选中根节点
    const target = selectedItem ? findTreeNodeByKey(treeData, selectedItem.key) : null;
    if (!target && treeData.length) {
      setSelectedItem(treeData[0]);
      props.onItemClick(treeData[0]);
      setExpandedKeys([treeData[0].key]);
    }

    // 如果是同一个 key，但不是同一个对象，则重新触发一次更新
    if (target && target !== selectedItem) {
      setSelectedItem(target);
      props.onItemClick(target);
    }
  }, [treeData]);

  useEffect(() => {
    const listener1 = () => reloadTreeData();
    const listener2 = (key: string) => {
      const target = findTreeNodeByKey(treeData, key);
      handleItemSelect([key], { selectedNodes: [target] });
      setExpandedKeys([`l1-${target?.projectId}`, `l2-${target?.moduleId}`]);
    };

    // 右侧页面在新增场景后，左侧的 tree 也需要刷新
    props.emitter.on('SCENE::RELOAD_TREE', listener1);
    // 右侧页面选中了场景，左侧直接定位到相应的场景节点
    props.emitter.on('SCENE::SELECT_TREE_NODE', listener2);

    return () => {
      props.emitter.off('SCENE::RELOAD_TREE', listener1);
      props.emitter.off('SCENE::SELECT_TREE_NODE', listener2);
    };
  });

  const handleSceneEditorSave = () => {
    setSceneEditorMode('HIDE');
    reloadTreeData();

    // 如果右侧显示的是场景列表，则触发一次更新
    if (selectedItem?.level !== 3) {
      props.emitter.emit('SCENE::RELOAD_SCENE_LIST');
    }
  };

  const handleSceneCloneSave = () => {
    setCloneTargetNode(undefined);
    reloadTreeData();
  };

  // 选择一个节点
  const handleItemSelect = (nextKeys: React.Key[], info: any) => {
    if (!nextKeys.length) return; // 禁止反选

    const item: TreeNode = info.selectedNodes[0];
    if (item === selectedItem) return; // 防止重复点击

    console.log('>> selected', item);
    setSelectedItem(item);
    props.onItemClick(item);
  };

  // 节点上的各种操作
  const handleNodeAction = useCallback(
    (action: nodeAction, node: TreeNode) => {
      // 重新指定触发节点
      targetNodeRef.current = node;

      switch (action) {
        case 'addScene':
          setSceneEditorMode('ADD');
          break;
        case 'editScene':
          setSceneEditorMode('EDIT');
          break;
        case 'cloneScene':
          setCloneTargetNode(node);
          break;
        case 'delScene':
          Modal.confirm({
            title: '操作确认',
            content: `确定删除接口 ${node.title}？删除后相关数据将自动清除`,
            onOk: async () => {
              await postRequest(APIS.deleteScene, {
                data: { id: node.bizId!, type: 2 },
              });
              message.success('场景已删除！');
              // 删除节点后，更新 treeData ，会自动触发重置判断
              reloadTreeData();
              // 通知右侧也更新
              props.emitter.emit('SCENE::RELOAD_SCENE_LIST');
            },
          });
          break;
        default:
          break;
      }
    },
    [treeData],
  );

  return (
    <CardRowGroup.SlideCard width={244} className="page-scane-tree">
      <div className="scane-list-header">
        <Select
          options={projectOptions}
          value={searchProject}
          onChange={(v) => setSearchProject(v)}
          placeholder="项目"
        />
      </div>

      {treeLoading && !treeData.length ? (
        <div className="spin-wrapper">
          <Spin />
        </div>
      ) : null}
      {!treeLoading && !treeData.length ? (
        <Empty description="未找到数据" style={{ marginTop: 60 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : null}

      <Tree
        className="custom-tree"
        key={searchProject || 1}
        blockNode
        treeData={treeData}
        selectedKeys={selectedItem ? [selectedItem.key] : []}
        onSelect={handleItemSelect}
        expandedKeys={expandedKeys}
        onExpand={(keys, info) => setExpandedKeys(keys)}
        showIcon={false}
        titleRender={
          ((nodeData: TreeNode) => (
            <div className="custom-tree-node">
              <span>{nodeData.title}</span>
              {/* 添加子节点：场景 */}
              {nodeData.level === 2 && (
                <a title="添加子节点：场景" {...stopProp}>
                  <PlusOutlined onClick={() => handleNodeAction('addScene', nodeData)} />
                </a>
              )}
              {/* 编辑场景 */}
              {nodeData.level === 3 && (
                <a title="编辑场景" {...stopProp}>
                  <EditOutlined onClick={() => handleNodeAction('editScene', nodeData)} />
                </a>
              )}
              {/* 复制场景 */}
              {nodeData.level === 3 && (
                <a title="复制场景" {...stopProp}>
                  <CopyOutlined onClick={() => handleNodeAction('cloneScene', nodeData)} />
                </a>
              )}
              {/* 删除场景 */}
              {nodeData.level === 3 && (
                <a title="删除场景" {...stopProp}>
                  <VCCustomIcon onClick={() => handleNodeAction('delScene', nodeData)} type="icondelete" />
                </a>
              )}
            </div>
          )) as any
        }
      />

      <SceneEditor
        mode={sceneEditorMode}
        targetNode={targetNodeRef.current}
        onClose={() => setSceneEditorMode('HIDE')}
        onSave={handleSceneEditorSave}
      />

      <SceneClone
        target={cloneTargetNode}
        onClose={() => setCloneTargetNode(undefined)}
        onSave={handleSceneCloneSave}
      />
    </CardRowGroup.SlideCard>
  );
}
