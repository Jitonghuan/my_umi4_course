import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button, Select, Input, Row, Tag } from 'antd';

import './index.less';

export interface MemberEditorProps {
  mode?: EditorMode;
  onClose: () => any;
  onSave: () => any;
}

export default function MemberEditor(props: MemberEditorProps) {
  const { mode, onClose, onSave } = props;

  const [editForm] = Form.useForm<Record<string, string>>();
  const [viewDisabled, seViewDisabled] = useState<boolean>(false);
  const [accountMode, setAccountMode] = useState<EditorMode>('HIDE');

  useEffect(() => {
    if (mode === 'HIDE') return;

    return () => {
      seViewDisabled(false);
      editForm.resetFields();
    };
  }, [mode]);
  const handleSubmit = async () => {
    const params = await editForm.validateFields();
  };

  return (
    <>
      <Drawer
        width={900}
        title={mode === 'EDIT' ? '编辑实例' : mode === 'VIEW' ? '查看实例' : '新接入实例'}
        placement="right"
        visible={mode !== 'HIDE'}
        onClose={onClose}
        maskClosable={false}
        footer={
          <div className="drawer-footer">
            <Button type="primary" loading={false} onClick={handleSubmit} disabled={viewDisabled}>
              保存
            </Button>
            <Button type="default" onClick={onClose}>
              取消
            </Button>
          </div>
        }
      >
        <Form form={editForm} labelCol={{ flex: '120px' }}>
          <Form.Item label="实例名称" name="name" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={viewDisabled} style={{ width: 520 }} />
          </Form.Item>
          <Form.Item label="数据库类型" name="characterset">
            <Select options={[]} disabled={viewDisabled} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="数据库版本" name="name" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={viewDisabled} style={{ width: 520 }} />
          </Form.Item>

          <Row>
            <Form.Item label="所属集群" name="accountId" rules={[{ required: true, message: '请选择' }]}>
              <Select options={[]} disabled={viewDisabled} style={{ width: 300 }} placeholder="默认可以先不授权" />
            </Form.Item>
            {mode === 'ADD' && (
              <span style={{ marginTop: 4 }}>
                <Tag
                  color="geekblue"
                  onClick={() => {
                    setAccountMode('ADD');
                  }}
                >
                  新增集群
                </Tag>
              </span>
            )}
          </Row>
          <Form.Item label="集群角色" name="owner" rules={[{ required: true, message: '请选择' }]}>
            <Select options={[]} disabled={viewDisabled} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="实例地址" name="name" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={viewDisabled} style={{ width: 520 }} placeholder="格式如：192.168.0.1" />
          </Form.Item>
          <Form.Item label="端口" name="name" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={viewDisabled} style={{ width: 520 }} />
          </Form.Item>
          <Form.Item label="数据库账号" name="name" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={viewDisabled} style={{ width: 520 }} />
          </Form.Item>
          <Form.Item label="数据库密码" name="name" rules={[{ required: true, message: '请输入' }]}>
            <Input.Password disabled={viewDisabled} style={{ width: 520 }} />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea style={{ width: 520 }}></Input.TextArea>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
