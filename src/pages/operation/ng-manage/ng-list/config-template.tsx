import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'antd';
import { record, ConfigProp } from '../type';
import AceEditor from '@/components/ace-editor';
export default function ConfigT(props: ConfigProp) {
  const { visible, value, handleCancel, code } = props;
  const [form] = Form.useForm();
  //   console.log(value, code, 1333);
  console.log(value, 11);
  console.log(code, 122);

  const [readOnly, setReadOnly] = useState<boolean>(false);
  const handleOk = () => {
    const values = form.getFieldValue('value');
    console.log(values, 7777);
  };
  const handleEdit = () => {
    setReadOnly((value) => !value);
  };
  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        value,
      });
    }
  }, [value]);
  return (
    <Modal
      title="配置模版"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={[
        { readOnly } && (
          <Button type="primary" style={{ position: 'absolute', left: '20px' }} onClick={handleEdit}>
            编辑
          </Button>
        ),
        <Button key="submit" type="primary" onClick={handleCancel}>
          取消
        </Button>,
        <Button type="primary" onClick={handleOk}>
          提交
        </Button>,
      ]}
    >
      <div className="code-title">NG实例CODE：{code}</div>
      <div>
        <Form>
          <Form.Item name="value" form={form}>
            <AceEditor mode="yaml" height={600} readOnly={readOnly} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
