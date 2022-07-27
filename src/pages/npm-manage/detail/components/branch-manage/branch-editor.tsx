import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Input, Form, message, Select } from 'antd';
import { createFeatureBranchUrl } from '../../server';
import { postRequest } from "@/utils/request";

export interface IProps {
  mode?: EditorMode;
  appCode: string;
  masterBranchOptions: any;
  selectMaster: any;
  onClose: () => void;
  onSubmit: () => void;
}

export default function BranchEditor(props: IProps) {
  const { mode, appCode, onClose, onSubmit, masterBranchOptions, selectMaster } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      const res = await postRequest(createFeatureBranchUrl, {
        data: {
          appCode,
          isNpm: true,
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
    form.setFieldsValue({
      masterBranch: selectMaster
    });
  }, [mode]);

  return (
    <Modal
      destroyOnClose
      width={600}
      title={mode === 'ADD' ? '新建分支' : '编辑分支'}
      visible={props.mode !== 'HIDE'}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ flex: '100px' }}>
        <Form.Item label="主干分支" name="masterBranch" rules={[{ required: true, message: '请选择主干分支' }]}>
          <Select options={masterBranchOptions} />
        </Form.Item>
        <Form.Item label="分支名称" name="branchName" rules={[{ required: true, message: '请输入分支名' }]}>
          <Input addonBefore="feature_" autoFocus />
        </Form.Item>
        <Form.Item label="描述" name="desc">
          <Input.TextArea placeholder="请输入描述" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
