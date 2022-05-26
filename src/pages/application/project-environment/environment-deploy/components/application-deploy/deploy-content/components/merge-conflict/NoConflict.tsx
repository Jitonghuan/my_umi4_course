import { Modal, Button } from '@cffe/h2o-design';
import React, { useState } from 'react';
import { IProp } from './types';

export default function NoConflict(prop: IProp) {
  const { visible, handleCancel, retryMergeClick } = prop;
  const [loading, setLoading] = useState(false);
  const handleOk = () => {
    handleCancel();
    retryMergeClick();
  };

  return (
    <>
      <Modal
        title="冲突详情"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleCancel} loading={loading}>
            取消
          </Button>,
          <Button type="primary" onClick={handleOk} loading={loading}>
            确定
          </Button>,
        ]}
      >
        <p>未检测到冲突，是否要重新部署？</p>
      </Modal>
    </>
  );
}
