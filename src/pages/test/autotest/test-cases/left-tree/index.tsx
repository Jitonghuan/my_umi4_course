// test case list
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 16:29

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Select, Tree, Spin, Empty, message } from 'antd';
import { PlusSquareFilled, PlusOutlined, EditOutlined } from '@ant-design/icons';
import VCCustomIcon from '@cffe/vc-custom-icon';
import { CardRowGroup } from '@/components/vc-page-content';
import * as APIS from '../../service';
import { postRequest } from '@/utils/request';
import { TreeNode, TreeNodeSaveData, EditorMode } from '../../interfaces';
import { useProjectOptions, useLeftTreeData } from '../hooks';
import { findTreeNodeByKey, getMergedList } from '../../common';
import ProjectEditor from '../../components/project-editor';
import ModuleEditor from '../../components/module-editor';
import ApiEditor from '../../components/api-editor';
import './index.less';

export interface LeftTreeProps extends Record<string, any> {
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
  const [projectOptions, setProjectOptions, reloadProjectOptions] = useProjectOptions();
  const [searchProject, setSearchProject] = useState<number>();
  const [treeData, treeLoading, setTreeData, reloadTreeData] = useLeftTreeData(searchProject);
  const [selectedItem, setSelectedItem] = useState<TreeNode>();
  // 当前操作的节点（或者触发节点）
  const targetNodeRef = useRef<TreeNode>();
  const [projectEditorMode, setProjectEditorMode] = useState<EditorMode>('HIDE');
  const [moduleEditorMode, setModuleEditoraMode] = useState<EditorMode>('HIDE');
  const [apiEditorMode, setApiEditorMode] = useState<EditorMode>('HIDE');
  const [expandedKeys, setExpandedKeys] = useState<(number | string)[]>([]);

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
    // if (!selectedItem) return;

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
      // setSelectedItem(undefined);
      // props.onItemClick(undefined);
    }
  }, [treeData]);

  // ------ callbacks
  // 项目 新增/编辑 完成后的操作
  const handleProjectEditorSave = (data: TreeNodeSaveData, targetNode: TreeNode) => {
    const prevMode = projectEditorMode;
    setProjectEditorMode('HIDE');

    if (prevMode === 'ADD') {
      // 重新刷新列表
      reloadProjectOptions();
    } else {
      // 更新列表
      const nextProjects = getMergedList(
        projectOptions,
        {
          label: data.name,
          value: data.id,
        },
        (item, addon) => item.value === addon.value,
      );
      setProjectOptions(nextProjects);

      // 更新树节点
      const nextTreeData = getMergedList(
        treeData,
        {
          title: data.name,
          key: targetNode.key,
          desc: data.desc,
        },
        (item, addon) => item.key === addon.key,
      );
      setTreeData(nextTreeData);
    }
  };

  // 模块 新增/编辑 完成后的操作
  // 目前来看，保存后只要再刷新一下列表就可以了
  const handleModuleEditorSave = (data: TreeNodeSaveData) => {
    // const prevMode = moduleEditorMode;
    setModuleEditoraMode('HIDE');
    reloadTreeData();
  };

  // 接口 新增/编辑 完成后的操作
  const handleApiEditorSave = () => {
    setApiEditorMode('HIDE');
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
        case 'addModule':
          setModuleEditoraMode('ADD');
          break;
        case 'addApi':
          setApiEditorMode('ADD');
          break;
        case 'editProject':
          setProjectEditorMode('EDIT');
          break;
        case 'editModule':
          setModuleEditoraMode('EDIT');
          break;
        case 'editApi':
          setApiEditorMode('EDIT');
          break;
        case 'delProject':
          Modal.confirm({
            title: '操作确认',
            content: `确定删除项目 ${node.title} ？删除后相关数据将自动清除`,
            onOk: async () => {
              await postRequest(APIS.deleteApiTreeNode, {
                data: { id: node.bizId!, type: 0 },
              });
              message.success('项目已删除!');

              // 节点删除后，自动选中第 0 个
              const nextProjectList = projectOptions?.slice(0) || [];
              const index = nextProjectList.findIndex((n) => n.value === searchProject);
              index > -1 && nextProjectList?.splice(index, 1);
              setProjectOptions(nextProjectList);
            },
          });
          break;
        case 'delModule':
          Modal.confirm({
            title: '操作确认',
            content: `确定删除模块 ${node.title}？删除后相关数据将自动清除`,
            onOk: async () => {
              await postRequest(APIS.deleteApiTreeNode, {
                data: { id: node.bizId!, type: 1 },
              });
              message.success('模块已删除!');
              // 删除节点后，更新 treeData （更新后，会自动触发重置判断）
              reloadTreeData();
            },
          });
          break;
        case 'delApi':
          Modal.confirm({
            title: '操作确认',
            content: `确定删除接口 ${node.title}？删除后相关数据将自动清除`,
            onOk: async () => {
              await postRequest(APIS.deleteApiTreeNode, {
                data: { id: node.bizId!, type: 2 },
              });
              message.success('接口已删除！');
              // 删除api节点后，更新 treeData ，会自动触发重置判断
              reloadTreeData();
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
    <CardRowGroup.SlideCard width={244} className="page-case-list">
      <div className="case-list-header">
        <Select
          options={projectOptions}
          value={searchProject}
          onChange={(v) => setSearchProject(v)}
          placeholder="项目"
        />
        <a onClick={() => setProjectEditorMode('ADD')} title="添加项目">
          <PlusSquareFilled style={{ fontSize: 24 }} />
        </a>
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
        blockNode
        key={searchProject || 1}
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
              {/* 编辑项目 */}
              {nodeData.level === 1 && (
                <a title="编辑项目" {...stopProp}>
                  <EditOutlined onClick={() => handleNodeAction('editProject', nodeData)} />
                </a>
              )}
              {/* 添加子节点：模块 */}
              {nodeData.level === 1 && (
                <a title="添加子节点：模块" {...stopProp}>
                  <PlusOutlined onClick={() => handleNodeAction('addModule', nodeData)} />
                </a>
              )}
              {/* 删除项目 */}
              {nodeData.level === 1 && (
                <a title="删除项目" {...stopProp}>
                  <VCCustomIcon onClick={() => handleNodeAction('delProject', nodeData)} type="icondelete" />
                </a>
              )}

              {/* 编辑模块 */}
              {nodeData.level === 2 && (
                <a title="编辑模块" {...stopProp}>
                  <EditOutlined onClick={() => handleNodeAction('editModule', nodeData)} />
                </a>
              )}
              {/* 添加子节点：接口 */}
              {nodeData.level === 2 && (
                <a title="添加子节点：接口" {...stopProp}>
                  <PlusOutlined onClick={() => handleNodeAction('addApi', nodeData)} />
                </a>
              )}
              {/* 删除模块 */}
              {nodeData.level === 2 && (
                <a title="删除模块" {...stopProp}>
                  <VCCustomIcon onClick={() => handleNodeAction('delModule', nodeData)} type="icondelete" />
                </a>
              )}

              {/* 编辑接口 */}
              {nodeData.level === 3 && (
                <a title="编辑接口" {...stopProp}>
                  <EditOutlined onClick={() => handleNodeAction('editApi', nodeData)} />
                </a>
              )}
              {/* 删除接口 */}
              {nodeData.level === 3 && (
                <a title="删除接口" {...stopProp}>
                  <VCCustomIcon onClick={() => handleNodeAction('delApi', nodeData)} type="icondelete" />
                </a>
              )}
            </div>
          )) as any
        }
      />

      <ProjectEditor
        mode={projectEditorMode}
        targetNode={targetNodeRef.current}
        onClose={() => setProjectEditorMode('HIDE')}
        onSave={handleProjectEditorSave}
      />

      <ModuleEditor
        mode={moduleEditorMode}
        targetNode={targetNodeRef.current}
        onClose={() => setModuleEditoraMode('HIDE')}
        onSave={handleModuleEditorSave}
      />

      <ApiEditor
        mode={apiEditorMode}
        targetNode={targetNodeRef.current}
        onClose={() => setApiEditorMode('HIDE')}
        onSave={handleApiEditorSave}
      />
    </CardRowGroup.SlideCard>
  );
}
