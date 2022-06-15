// article editor
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/06/15 14:50

import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button, Select, Input, Switch } from 'antd';
import { typeOptions } from '../schema';
import UserSelector, { stringToList } from '@/components/user-selector';
import { updateAppMember } from '@/pages/application/service';
import { AppMemberInfo } from '@/pages/application/interfaces';
import RichText from '@/components/rich-text';

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
  }, [mode]);
  const handleSubmit = () => {};

  return (
    <Drawer
      width={700}
      title={mode === 'EDIT' ? '编辑' : mode === 'VIEW' ? '查看' : '新增'}
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
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入应用owner' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="类型" name="type">
          <Select options={typeOptions} />
        </Form.Item>
        <Form.Item label="内容" name="content">
          <RichText style={{ width: '500px', height: '600px' }} />
        </Form.Item>
        <Form.Item label="是否置顶" name="priority">
          <Switch />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
