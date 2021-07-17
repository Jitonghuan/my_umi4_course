// script editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/17 21:06

import React, { useState, useCallback } from 'react';
import { Modal, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export interface ScriptEditorProps extends Record<string, any> {
  value?: string;
  onChange?: (next: string) => any;
}

export default function ScriptEditor(props: ScriptEditorProps) {
  const { onChange, ...others } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState('');

  const handleChange = useCallback(
    (e: any) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const handleShowModal = useCallback(() => {
    setModalVisible(true);
    setTempValue(props.value || '');
  }, [props.value]);

  const handleOk = useCallback(() => {
    onChange?.(tempValue);
    setModalVisible(false);
  }, [tempValue]);

  const handleCancel = useCallback(() => setModalVisible(false), []);
  const handleTempChange = useCallback((e: any) => setTempValue(e.target.value), []);

  return (
    <>
      <Input
        {...others}
        onChange={handleChange}
        readOnly
        onClick={handleShowModal}
        suffix={<EditOutlined onClick={handleShowModal} />}
      />
      <Modal
        title="编辑脚本"
        width={720}
        visible={modalVisible}
        maskClosable={false}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Input.TextArea autoFocus value={tempValue} onChange={handleTempChange} rows={14} />
      </Modal>
    </>
  );
}
