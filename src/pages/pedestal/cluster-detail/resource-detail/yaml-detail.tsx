import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, message } from 'antd';
import AceEditor from '@/components/ace-editor';
import { putRequest } from '@/utils/request';
export default function YamlDetail(props: any) {
  const { visible, onClose, initData } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ value: initData?.yaml });
    }
  }, [initData, visible]);

  return (
    <Modal title="YAML详情" visible={visible} onCancel={onClose} width={'70%'} footer={false}>
      <div className="code-title"></div>
      <div>
        <Form form={form}>
          <Form.Item name="value">
            <AceEditor mode="yaml" height={'68vh'} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
