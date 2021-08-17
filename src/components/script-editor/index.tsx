// script editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/17 21:06

import React, { useState, useCallback } from 'react';
import { Modal, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import AceEditor, { isJSON } from '../ace-editor';

export interface ScriptEditorProps extends Record<string, any> {
  value?: string;
  onChange?: (next: string) => any;
  mode?: 'text' | 'json' | 'sql' | 'yaml';
}

export default function ScriptEditor(props: ScriptEditorProps) {
  const { onChange, mode = 'text', ...others } = props;
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
    if (mode === 'json' && !isJSON(tempValue)) {
      return message.warning('JSON数据格式不合法!');
    }

    onChange?.(tempValue);
    setModalVisible(false);
  }, [tempValue, mode]);

  const handleCancel = useCallback(() => setModalVisible(false), []);
  const handleAceTempChange = useCallback((v: string) => setTempValue(v), []);

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
        <AceEditor mode={mode} value={tempValue} onChange={handleAceTempChange} height={320} />
      </Modal>
    </>
  );
}
