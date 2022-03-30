import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, message } from 'antd';
import { record, ConfigProp } from '../type';
import AceEditor from '@/components/ace-editor';
import './config-template.less';
import { updateNg } from '../service';
import { putRequest } from '@/utils/request';
export default function ConfigT(props: ConfigProp) {
  const { visible, templateContext, handleCancel, code, id, onSave } = props;
  const [form] = Form.useForm();
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const handleOk = () => {
    const values = form.getFieldValue('value');
    putRequest(updateNg, {
      data: {
        id: id,
        templateContext: values,
        ngInstCode: code,
      },
    }).then((result) => {
      if (result.success) {
        message.success('编辑配置模版成功！');
        onSave?.();
      } else {
        message.error(result.errorMsg);
      }
    });
  };
  const handleEdit = () => {
    setReadOnly((value) => !value);
  };
  useEffect(() => {
    if (templateContext) {
      form.setFieldsValue({
        value: templateContext,
      });
    } else {
      form.setFieldsValue({
        value: '',
      });
    }
  }, [templateContext, visible]);
  useEffect(() => {
    if (visible) {
      setReadOnly(true);
    }
  }, [visible]);
  return (
    <Modal
      title="配置模版"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={'60%'}
      footer={[
        <Button type="primary" danger={!readOnly} style={{ position: 'absolute', left: '20px' }} onClick={handleEdit}>
          {readOnly ? '编辑' : '保存编辑'}
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
            <AceEditor mode="yaml" readOnly={readOnly} height={'65vh'} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
