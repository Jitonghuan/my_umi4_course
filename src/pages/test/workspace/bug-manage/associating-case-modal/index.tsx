import React, { useState, useEffect } from 'react';
import { Button, Modal, Tree, Space, Spin } from 'antd';
import * as HOOKS from '../../hooks';
import './index.less';

export default function AssociatingCaseModal(props: any) {
  const { bugId, visible, setVisible, onSave } = props;
  const [treeData, _checkedKeys, _expandedKeys, querySubNode] = HOOKS.useBugAssociatedCaseTree(bugId);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    setCheckedKeys(_checkedKeys);
    setExpandedKeys(_expandedKeys);
  }, [_checkedKeys, _expandedKeys]);

  const submit = () => {
    onSave && onSave(checkedKeys);
    setVisible(false);
  };

  const onLoadData = async ({ id }: any) => {
    await querySubNode(id);
  };

  return (
    <Modal
      className="test-workspace-test-plan-add-test-plan-modal"
      visible={visible}
      width="650"
      title="关联用例"
      maskClosable={false}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      {!treeData?.length ? (
        <div
          style={{
            width: '100%',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin tip="Loading..." />
        </div>
      ) : (
        <Tree
          loadData={onLoadData}
          checkable
          treeData={treeData}
          checkedKeys={checkedKeys}
          onCheck={(checkedKeys) => setCheckedKeys(checkedKeys as React.Key[])}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
        />
      )}

      <div className="btn-container">
        <Space>
          <Button type="primary" onClick={submit}>
            确定
          </Button>
          <Button type="primary" onClick={() => setVisible(false)}>
            取消
          </Button>
        </Space>
      </div>
    </Modal>
  );
}
