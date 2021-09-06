// func editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 10:43

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Form, Modal, message, } from 'antd';
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

export default function FuncEditor(props: FuncEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { mode, initData, onClose, onSave } = props;
  const [pending, setPending] = useState(false);
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (mode === 'HIDE') return;

    editForm.resetFields();
    if (mode === 'ADD') return;

    editForm.setFieldsValue({
      funcBody: initData?.func || ''
    });

  }, [mode]);

  const handleSubmit = useCallback(async () => {
    const { funcBody } = await editForm.validateFields();
    const payload = {
      funcBody: base64Encode(funcBody),
      modifyUser: userInfo.userName,
    };

    setPending(true);
    try {
      if (mode === 'ADD') {
        await postRequest(APIS.addFunc, {
          data: {
            ...payload,
            createUser: userInfo.userName,
          },
        });
      } else {
        await postRequest(APIS.updateFunc, {
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
      title={mode === 'ADD' ? '添加函数' : '编辑函数'}
      visible={mode !== 'HIDE'}
      maskClosable={false}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={pending}
      width={800}
    >
      <Form form={editForm}>
        <Form.Item name="funcBody" rules={[{ required: true, message: '函数内容不能为空！' }]}>
          <AceEditor placeholder="请输入函数" mode="text" height={400} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
