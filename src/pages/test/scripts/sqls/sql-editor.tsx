// sql editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 10:43

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Form, Input, Modal, message, } from 'antd';
import FELayout from '@cffe/vc-layout';
import * as APIS from './service';
import { postRequest } from '@/utils/request';
import { base64Encode } from '@/utils';
import AceEditor from '@/components/ace-editor';

export interface FuncEditorProps {
  mode: EditorMode;
  initData?: Record<string, any>;
  onClose?: () => any;
  onSave?: () => any;
}

export default function SQLEditor(props: FuncEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { mode, initData, onClose, onSave } = props;
  const [pending, setPending] = useState(false);
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (mode === 'HIDE') return;

    editForm.resetFields();
    if (mode === 'ADD') return;

    editForm.setFieldsValue({
      ...initData,
    });

  }, [mode]);

  const handleSubmit = useCallback(async () => {
    const values = await editForm.validateFields();
    const payload = {
      ...values,
      scripts: base64Encode(values.scripts),
      modifyUser: userInfo.userName,
    };

    setPending(true);
    try {
      if (mode === 'ADD') {
        await postRequest(APIS.addSql, {
          data: {
            ...payload,
            createUser: userInfo.userName,
          },
        });
      } else {
        await postRequest(APIS.modifySql, {
          data: {
            id: initData?.id,
            ...payload,
          },
        });
      }

      message.success('保存成功！');
      onSave?.();
    } finally {
      setPending(false);
    }

  }, [mode, editForm]);

  return (
    <Modal
      title={mode === 'ADD' ? '添加SQL' : '编辑SQL'}
      visible={mode !== 'HIDE'}
      maskClosable={false}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={pending}
      width={800}
    >
      <Form form={editForm} labelCol={{ flex: '90px' }} wrapperCol={{ span: 20 }}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入SQL名称' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="描述" name="desc" rules={[{ required: true, message: '请输入SQL描述' }]}>
          <Input.TextArea rows={2} placeholder="请输入描述" />
        </Form.Item>
        <Form.Item label="内容" name="script" rules={[{ required: true, message: 'SQL内容不能为空！' }]}>
          <AceEditor placeholder="请输入SQL" mode="sql" height={240} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
