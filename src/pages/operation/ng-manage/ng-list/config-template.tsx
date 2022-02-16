import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'antd';
import { record, ConfigProp } from '../type';
import AceEditor from '@/components/ace-editor';
import './config-template.less';
export default function ConfigT(props: ConfigProp) {
  const { visible, templateContext, handleCancel, code } = props;
  console.log('context:', templateContext);
  const [form] = Form.useForm();
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const handleOk = () => {
    const values = form.getFieldValue('value');
    console.log(values, 7777);
  };
  const handleEdit = () => {
    setReadOnly((value) => !value);
  };
  useEffect(() => {
    if (templateContext) {
      form.setFieldsValue({
        value: templateContext,
      });
    }
  }, [templateContext]);
  return (
    <Modal
      title="配置模版"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button type="primary" danger={!readOnly} style={{ position: 'absolute', left: '20px' }} onClick={handleEdit}>
          {readOnly ? '编辑' : '取消编辑'}
        </Button>,
        <Button key="submit" type="primary" onClick={handleCancel}>
          取消
        </Button>,
        <Button type="primary" onClick={handleOk}>
          提交
        </Button>,
      ]}
    >
      <div className="code-title">
        NG实例CODE：<span>{code}</span>
      </div>
      <div>
        <Form form={form}>
          <Form.Item name="value">
            <AceEditor mode="yaml" height={450} readOnly={readOnly} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
