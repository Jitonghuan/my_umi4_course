import React, { useState, useEffect } from 'react';
import { Modal, Spin, Tree, Space, Button, message } from 'antd';
import * as HOOKS from '../../../../hooks';

interface ISelectCaseModal {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (value: any) => void;
}

export default function SelectCaseModal(props: any) {
  const [treeData, querySubNode] = HOOKS.useAssociatedCaseTree();
  const [checkedNode, setCheckedNode] = useState<any>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const submit = () => {
    if (!checkedNode) {
      message.warning('请选择用例');
      return;
    }
    props.onSelect(checkedNode);
    props.setVisible(false);
  };

  const onLoadData = async ({ id }: any) => {
    await querySubNode(id);
  };

  const handleSelect = (_: any, { node }: any) => {
    if (node.isLeaf) {
      setCheckedNode(node);
    } else {
      setCheckedNode(undefined);
    }
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={() => props.setVisible(false)}
      title="选择用例"
      footer={
        <Space>
          <Button type="primary" onClick={submit}>
            确定
          </Button>
          <Button type="primary" onClick={() => props.setVisible(false)}>
            取消
          </Button>
        </Space>
      }
    >
      <div style={{ height: '520px', overflow: 'auto' }}>
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
            // checkable
            treeData={treeData}
            onSelect={handleSelect}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
          />
        )}
      </div>
    </Modal>
  );
}
