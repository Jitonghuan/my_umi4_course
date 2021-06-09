// 用例管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useCallback, useMemo, useLayoutEffect } from 'react';
import Emitter from 'events';
import MatrixPageContent from '@/components/matrix-page-content';
import { CardRowGroup } from '@/components/vc-page-content';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import CaseEditor from './case-editor';
import { EditorMode, TreeNode, CaseItemVO } from './interfaces';
import './index.less';

export default function TestCaseManager() {
  const [current, setCurrent] = useState<TreeNode>();
  const [editorData, setEditorData] = useState<CaseItemVO>();
  const [caseEditorMode, setCaseEditorMode] = useState<EditorMode>('HIDE');

  const emitter = useMemo(() => {
    return new Emitter();
  }, []);

  useLayoutEffect(() => {
    emitter.on('CASE::ADD_CASE', () => {
      setEditorData(undefined);
      setCaseEditorMode('ADD');
    });
    emitter.on('CASE::EDIT_CASE', (item: CaseItemVO) => {
      console.log('>>>>CASE::EDIT_CASE', item);
      setEditorData(item);
      setCaseEditorMode('EDIT');
    });
  }, []);

  const handleSave = useCallback(() => {
    setCaseEditorMode('HIDE');

    emitter.emit('CASE::RELOAD_CASE', editorData);
  }, [current, editorData]);

  return (
    <MatrixPageContent isFlex>
      <CardRowGroup>
        <LeftTree onItemClick={(item) => setCurrent(item)} emitter={emitter} />
        <RightDetail
          key={current?.key || 1}
          current={current}
          emitter={emitter}
        />
      </CardRowGroup>
      <CaseEditor
        mode={caseEditorMode}
        initData={editorData}
        current={current}
        onCancel={() => setCaseEditorMode('HIDE')}
        onSave={handleSave}
      />
    </MatrixPageContent>
  );
}
