import React, {useState} from 'react';
import { Modal } from 'antd';
import LoggerSearch from "./log-search";

interface IProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (str: string) => void;
  initData?: {
    querySql?: string;
    envCode?: string;
  }
}
const PromqlEditPreview = (props: IProps) => {
  const { visible, onClose, onConfirm, initData = {} } = props;
  const [promql, setPromql] = useState('');

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      closable={false}
      onOk={() => {
        onConfirm(promql)
      }}
      width="1100px"
      destroyOnClose
      maskClosable={false}
    >
      <LoggerSearch initData={initData} onChange={setPromql} />
    </Modal>
  )
}

export default PromqlEditPreview;
