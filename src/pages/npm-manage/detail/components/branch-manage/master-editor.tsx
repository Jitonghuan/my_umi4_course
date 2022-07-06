import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Input, Form, message } from 'antd';
import { createMainBranch } from '../../server';
import { postRequest } from '@/utils/request';

export interface IProps {
  mode?: EditorMode;
  appCode: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function MasterBranchEditor(props: IProps) {
  const { mode, appCode, onClose, onSubmit } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      const res = await postRequest(createMainBranch, {
        data: {
          appCode,
          ...values
        }
      });
      if (res.success) {
        message.success('操作成功！');
        onSubmit?.();
      }
    } finally {
      setLoading(false);
    }
  }, [form, appCode]);

  useEffect(() => {
    if (mode === 'HIDE') return;
    form.resetFields();
  }, [mode]);

  return (
    <Modal
      destroyOnClose
      width={600}
      title='新建主干'
      visible={props.mode !== 'HIDE'}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ flex: '100px' }}>
        <Form.Item label="分支名称" name="branchName" rules={[{ required: true, message: '请输入分支名' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="描述" name="desc">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
