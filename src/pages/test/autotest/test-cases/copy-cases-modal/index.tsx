import React, { useState } from 'react';
import { Modal, TreeSelect } from 'antd';
import './index.less';

export default function CopyCasesModal(props: any) {
  const { onOk, onCancel, treeData, visible } = props;
  const [apiId, setApiId] = useState<React.Key>();

  const handleSelect = (val: string) => {
    if (val.split('-')[0] !== 'l3') return;
    setApiId(val);
  };

  return (
    <Modal
      className="copy-cases-modal"
      visible={visible}
      onOk={() => onOk(apiId && (apiId as string).split('-')[1])}
      onCancel={onCancel}
      title="复制用例"
    >
      <TreeSelect
        treeData={treeData}
        onSelect={(val) => handleSelect(val as string)}
        value={apiId}
        treeNodeFilterProp="title"
      />
    </Modal>
  );
}
