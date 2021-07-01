// 左侧定位到项目、模块时右侧显示场景列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 20:47

import React, { useState } from 'react';
import { Button, Table } from 'antd';
import type Emitter from 'events';
import { ContentCard } from '@/components/vc-page-content';
import { TreeNode, EditorMode, SceneItemVO } from '../../interfaces';
import { useSceneList } from '../hooks';
import { createNodeDataFromSceneItem } from '../../common';
import SceneEditor from '../../components/scene-editor';

export interface SceneListProps extends Record<string, any> {
  emitter: Emitter;
  /** 当前选中的节点 */
  current?: TreeNode;
}

export default function SceneList(props: SceneListProps) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sceneSource, total, isLoading, setData, loadData] = useSceneList(
    props.current?.bizId!,
    props.current?.level! - 1,
    pageIndex,
    pageSize,
  );
  const [sceneEditorMode, setSceneEditorMode] = useState<EditorMode>('HIDE');
  const [targetNode, setTargetNode] = useState<TreeNode>();

  const handleSceneEditorSave = () => {
    // 通知左侧的列表也更新
    props.emitter.emit('SCENE::RELOAD_TREE');
    setSceneEditorMode('HIDE');
    // 如果在第一页，则主动更新，否则切换到第一页触发更新
    pageIndex === 1 ? loadData() : setPageIndex(1);
  };

  const handleEditScene = (record: SceneItemVO) => {
    // 构造一个节点
    const node = createNodeDataFromSceneItem(record);
    setTargetNode(node);
    setSceneEditorMode('EDIT');
  };

  const handleAddScene = () => {
    setSceneEditorMode('ADD');
    setTargetNode(props.current);
  };

  const handleSelectSceneItem = (item: SceneItemVO) => {
    console.log('>>>>> handleSelectSceneItem', item);

    const node = createNodeDataFromSceneItem(item);
    props.emitter.emit('SCENE::SELECT_SCENE', node);
  };

  const handleExecScene = (record: SceneItemVO) => {
    console.log('> handleExecScene', record);
  };

  return (
    <ContentCard>
      <div className="page-scene-header">
        <h3>{props.current?.title}</h3>
        {props.current?.level === 2 ? (
          <Button type="primary" onClick={handleAddScene}>
            新增场景
          </Button>
        ) : null}
      </div>
      <Table
        dataSource={sceneSource}
        loading={isLoading}
        pagination={{
          current: pageIndex,
          total,
          pageSize,
          showSizeChanger: true,
          onChange: (next) => setPageIndex(next),
          onShowSizeChange: (_, next) => {
            setPageIndex(1);
            setPageSize(next);
          },
        }}
      >
        <Table.Column
          dataIndex="id"
          title="ID"
          width={80}
          render={(value, record: SceneItemVO) => <a onClick={() => handleSelectSceneItem(record)}>{value}</a>}
        />
        <Table.Column dataIndex="projectName" title="项目" />
        <Table.Column dataIndex="name" title="场景名称" />
        <Table.Column dataIndex="desc" title="场景描述" />
        <Table.Column dataIndex="cases" title="用例" />
        <Table.Column
          title="操作"
          render={(_, record: SceneItemVO, index) => (
            <div className="action-cell">
              <a onClick={() => handleEditScene(record)}>编辑</a>
              <a onClick={() => handleExecScene(record)}>执行</a>
            </div>
          )}
          width={110}
        />
      </Table>

      <SceneEditor
        mode={sceneEditorMode}
        targetNode={targetNode}
        onClose={() => setSceneEditorMode('HIDE')}
        onSave={handleSceneEditorSave}
      />
    </ContentCard>
  );
}
