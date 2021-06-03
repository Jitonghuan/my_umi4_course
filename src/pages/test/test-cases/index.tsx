// 用例管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useRef, useState, useCallback, useLayoutEffect } from 'react';
import Emitter from 'events';
import MatrixPageContent from '@/components/matrix-page-content';
import { CardRowGroup } from '@/components/vc-page-content';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import CaseEditor from './case-editor';
import { TreeNode, CaseItemVO } from './interfaces';
import './index.less';

export default function TestCaseManager() {
  const emitterRef = useRef(new Emitter());
  const [current, setCurrent] = useState<TreeNode>();
  const [addCaseVisible, setAddCaseVisible] = useState<boolean>(false);
  const [editorData, setEditorData] = useState<CaseItemVO>();

  useLayoutEffect(() => {
    emitterRef.current.on('CASE::ADD_CASE', () => {
      setEditorData(undefined);
      setAddCaseVisible(true);
    });
    emitterRef.current.on('CASE::EDIT_CASE', (item: CaseItemVO) => {
      console.log('>>>>CASE::EDIT_CASE', item);
      setEditorData(item);
      setAddCaseVisible(true);
    });
  }, []);

  const handleSave = useCallback(() => {
    setAddCaseVisible(false);

    emitterRef.current.emit('CASE::RELOAD_CASE', editorData);
  }, [current, editorData]);

  return (
    <MatrixPageContent isFlex>
      <CardRowGroup>
        <LeftTree
          onItemClick={(item) => setCurrent(item)}
          emitter={emitterRef.current}
        />
        <RightDetail
          key={current?.key || 1}
          current={current}
          emitter={emitterRef.current}
        />
      </CardRowGroup>
      <CaseEditor
        visible={addCaseVisible}
        initData={editorData}
        onCancel={() => setAddCaseVisible(false)}
        onSave={handleSave}
      />
    </MatrixPageContent>
  );
}
