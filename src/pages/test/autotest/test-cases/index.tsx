// 用例管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useCallback, useMemo, useLayoutEffect, useRef } from 'react';
import Emitter from 'events';
import { CardRowGroup } from '@/components/vc-page-content';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import CaseEditor from '../_components/case-editor';
import CaseDetail from '../_components/case-detail';
import { TreeNode, CaseItemVO } from '../interfaces';
import { useLeftTreeData } from './hooks';
import './index.less';

export default function TestCaseManager() {
  const [current, setCurrent] = useState<TreeNode>();
  const [editorData, setEditorData] = useState<CaseItemVO>();
  const [caseEditorMode, setCaseEditorMode] = useState<EditorMode>('HIDE');
  const [detailData, setDetailData] = useState<CaseItemVO>();
  const [searchProject, setSearchProject] = useState<number>();
  const [treeData, treeLoading, setTreeData, reloadTreeData] = useLeftTreeData(searchProject);
  const apiDetailRef = useRef<Record<string, any>>();

  const emitter = useMemo(() => {
    return new Emitter();
  }, []);

  useLayoutEffect(() => {
    emitter.on('CASE::ADD_CASE', (apiDetail: Record<string, any>) => {
      setEditorData(undefined);
      apiDetailRef.current = apiDetail;
      setCaseEditorMode('ADD');
    });
    emitter.on('CASE::EDIT_CASE', (item: CaseItemVO) => {
      console.log('>>>>CASE::EDIT_CASE', item);
      setEditorData(item);
      setCaseEditorMode('EDIT');
    });
    emitter.on('CASE::DETAIL', (item: CaseItemVO) => {
      setDetailData(item);
    });
  }, []);

  const handleSave = useCallback(() => {
    setCaseEditorMode('HIDE');

    emitter.emit('CASE::RELOAD_CASE', editorData);
  }, [current, editorData]);

  return (
    <CardRowGroup>
      <LeftTree
        onItemClick={(item) => setCurrent(item)}
        searchProject={searchProject}
        setSearchProject={setSearchProject}
        treeData={treeData}
        treeLoading={treeLoading}
        setTreeData={setTreeData}
        reloadTreeData={reloadTreeData}
      />
      <RightDetail key={current?.key || 1} current={current} emitter={emitter} apiTreeData={treeData} />
      <CaseEditor
        mode={caseEditorMode}
        initData={editorData}
        current={current}
        apiDetail={apiDetailRef.current}
        onCancel={() => setCaseEditorMode('HIDE')}
        onSave={handleSave}
      />
      <CaseDetail data={detailData} onClose={() => setDetailData(undefined)} />
    </CardRowGroup>
  );
}
