// member editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/30 20:33

import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button } from 'antd';
import UserSelector, { stringToList } from '@/components/user-selector';
import { updateAppMember } from '@/pages/application/service';
import { AppMemberInfo } from '@/pages/application/interfaces';

export interface MemberEditorProps {
  mode?: EditorMode;
  initData?: AppMemberInfo;
  onClose: () => any;
  onSave: () => any;
}

export default function MemberEditor(props: MemberEditorProps) {
  const { mode, initData, onClose, onSave } = props;
  const [editForm] = Form.useForm<Record<string, string[]>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'HIDE' || !initData) return;

    editForm.resetFields();
    if (mode === 'ADD') return;

    // 编辑时转换为数组
    editForm.setFieldsValue({
      owner: stringToList(initData.owner),
      developerOwner: stringToList(initData.developerOwner),
      deployOwner: stringToList(initData.deployOwner),
      codeReviewer: stringToList(initData.codeReviewer),
      testOwner: stringToList(initData.testOwner),
      autoTestOwner: stringToList(initData.autoTestOwner),
      alertReceiver: stringToList(initData.alertReceiver),
    });
  }, [mode]);

  const handleSubmit = useCallback(async () => {
    const values = await editForm.validateFields();

    // 提交数据时转换成 string
    const submitData = {
      appCode: initData?.appCode!,
      owner: values.owner?.join(',') || '',
      developerOwner: values.developerOwner?.join(',') || '',
      deployOwner: values.deployOwner?.join(',') || '',
      codeReviewer: values.codeReviewer?.join(',') || '',
      testOwner: values.testOwner?.join(',') || '',
      autoTestOwner: values.autoTestOwner?.join(',') || '',
      alertReceiver: values.alertReceiver?.join(',') || '',
    };

    setLoading(true);
    try {
      await updateAppMember(submitData);
      message.success('保存成功！');
      onSave?.();
    } finally {
      setLoading(false);
    }
  }, [editForm, initData]);

  return (
    <Drawer
      width={700}
      title={mode === 'EDIT' ? '编辑成员' : '新增成员'}
      placement="right"
      visible={mode !== 'HIDE'}
      onClose={onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editForm} labelCol={{ flex: '120px' }}>
        <Form.Item label="应用Owner" name="owner" rules={[{ required: true, message: '请输入应用owner' }]}>
          <UserSelector />
        </Form.Item>
        <Form.Item label="开发负责人" name="developerOwner">
          <UserSelector />
        </Form.Item>
        <Form.Item label="发布负责人" name="deployOwner">
          <UserSelector />
        </Form.Item>
        <Form.Item label="CodeReviewer" name="codeReviewer">
          <UserSelector />
        </Form.Item>
        <Form.Item label="测试负责人" name="testOwner">
          <UserSelector />
        </Form.Item>
        <Form.Item label="自动化测试人员" name="autoTestOwner">
          <UserSelector />
        </Form.Item>
        <Form.Item label="报警接收人" name="alertReceiver">
          <UserSelector />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
