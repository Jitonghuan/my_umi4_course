import React from 'react';
import { Modal } from 'antd';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const PromqlEditPreview = (props: IProps) => {
  const { visible, onClose, onConfirm } = props;
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      onOk={onConfirm}
    >
    </Modal>
  )
}

export default PromqlEditPreview;
