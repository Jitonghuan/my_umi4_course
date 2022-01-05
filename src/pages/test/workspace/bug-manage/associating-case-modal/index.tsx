import React, { useState, useEffect } from 'react';
import { Button, Modal, Tree, Space, Spin } from 'antd';
import * as HOOKS from '../../hooks';
import './index.less';

export default function AssociatingCaseModal(props: any) {
  const { bugId, visible, setVisible, onSave, curRelatedCases } = props;
  const [treeData, loadData, _checkedNodes, _expandedKeys, querySubNode] = HOOKS.useBugAssociatedCaseTree(bugId);
  const [checkedNodes, setCheckedNodes] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [nedUpdate, setNedUpdate] = useState<boolean>(true);

  useEffect(() => {
    setExpandedKeys(_expandedKeys);
  }, [_expandedKeys]);

  useEffect(() => {
    if (visible && nedUpdate) {
      setNedUpdate(false);
      loadData();
    }
    if (visible) setCheckedNodes(curRelatedCases.map((item: any) => ({ ...item, key: item.id })));
  }, [visible]);

  useEffect(() => {
    setNedUpdate(true);
  }, [bugId]);

  const submit = () => {
    onSave && onSave(checkedNodes);
    setVisible(false);
  };

  const onLoadData = async ({ id }: any) => {
    await querySubNode(id);
  };

  return (
    <Modal
      className="test-workspace-test-plan-add-test-plan-modal"
      visible={visible}
      width={650}
      title="关联用例"
      maskClosable={false}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      <div className="body-container">
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
            checkedKeys={checkedNodes.map((item: any) => item.key)}
            onCheck={(_, { checkedNodes }) => {
              setCheckedNodes(checkedNodes);
            }}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
          />
        )}
      </div>

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
