/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 16:05:29
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-07 17:22:44
 * @FilePath: /fe-matrix/src/pages/database/database-manage/create-database/index.tsx
 * @Description: 新增账号
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button, Select, Input, Switch, Tag, Modal, Divider } from 'antd';
import { useCreateAccount } from '../../hook';
import './index.less';

export interface AccountEditorProps {
  mode: EditorMode;
  initData?: any;
  onClose: () => any;
  onSave: () => any;
}

export default function MemberEditor(props: AccountEditorProps) {
  const { mode, initData, onClose, onSave } = props;
  const [editForm] = Form.useForm<Record<string, string>>();
  const [viewDisabled, seViewDisabled] = useState<boolean>(false);
  const [createLoading, createAccount] = useCreateAccount();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isPriorityChangeOption, setIsPriorityChangeOption] = useState<number>(0);
  const [description, setDescription] = useState<any>(); // 富文本数据
  const [resetDescription, setResetDescription] = useState<any>(); // 重置富文本使用
  const [curType, setCurType] = useState<string>('');

  useEffect(() => {
    if (mode === 'HIDE' || !initData) return;
    setCurType(initData?.type);
    if (mode !== 'ADD') {
      if (initData.priority === 1) {
        setIsChecked(true);
        setIsPriorityChangeOption(1);
      } else {
        setIsChecked(false);
        setIsPriorityChangeOption(0);
      }

      editForm.setFieldsValue({
        title: initData?.title,
        type: initData?.type,
        content: initData?.content,
      });
      setResetDescription(initData?.content);
    }

    if (mode === 'VIEW') {
      seViewDisabled(true);
    }
    // if (mode === 'ADD') return;

    return () => {
      seViewDisabled(false);
      setIsChecked(false);
      setIsPriorityChangeOption(0);
      editForm.resetFields();
      setResetDescription('');
      setCurType('');
    };
  }, [mode]);
  const handleSubmit = async () => {
    const params = await editForm.validateFields();
    createAccount({ ...params, clusterId: 2 }).then(() => {
      onSave();
    });
  };
  /^\S*(?=\S{8,32})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/;

  return (
    <Modal
      width={900}
      title="新增账号"
      visible={mode !== 'HIDE'}
      onCancel={onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={createLoading} onClick={handleSubmit} disabled={viewDisabled}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Divider dashed plain style={{ marginBottom: 26 }}>
        <span style={{ color: 'red' }}>注：新建的账号无权限，需要使用授权功能授予相关权限</span>
      </Divider>
      <Form form={editForm} labelCol={{ flex: '120px' }}>
        <Form.Item label="数据库账号" name="user" rules={[{ required: true, message: '请输入' }]}>
          <Input disabled={viewDisabled} style={{ width: 520 }} />
        </Form.Item>
        <Form.Item label="授权地址" name="host" rules={[{ required: true, message: '请选择' }]}>
          <Input disabled={viewDisabled} style={{ width: 520 }} />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '输入密码不符合规则',
              pattern: /^.*(?=.{8,32})(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*? ]).*$/,
            },
          ]}
          hasFeedback
        >
          <Input.Password
            style={{ width: 400 }}
            placeholder="密码需要8-32个字符，至少包含英文、数字和特殊符号"
          ></Input.Password>
        </Form.Item>
        <Form.Item
          label="密码确认"
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认你的密码!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('密码输入不一致，请重新输入!'));
              },
            }),
          ]}
        >
          <Input.Password
            style={{ width: 400 }}
            placeholder="密码需要8-32个字符，至少包含英文、数字和特殊符号"
          ></Input.Password>
        </Form.Item>
        <Form.Item label="备注说明" name="description">
          <Input.TextArea style={{ width: 520 }}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
