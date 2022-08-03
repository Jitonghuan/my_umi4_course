/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 17:25:23
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-07 17:25:23
 * @FilePath: /fe-matrix/src/pages/database/account-manage/components/update-password/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect } from 'react';
import { Form, Button, Input, Modal } from 'antd';
import { useChangePassword } from '../../hook';

export interface AccountEditorProps {
  mode: EditorMode;
  curId?: any;
  clusterId: number;
  onClose: () => any;
  onSave: () => any;
}

export default function AccountEditor(props: AccountEditorProps) {
  const { mode, curId, onClose, onSave, clusterId } = props;
  const [editForm] = Form.useForm();
  const [updateLoading, updatePassword] = useChangePassword();

  useEffect(() => {
    if (mode === 'HIDE' || !curId) return;

    return () => {
      editForm.resetFields();
    };
  }, [mode]);
  const handleSubmit = async () => {
    const params = await editForm.validateFields();
    updatePassword({ password: params?.password, clusterId, id: curId }).then(() => {
      onSave();
    });
  };

  return (
    <Modal
      width={700}
      title="更改密码"
      visible={mode !== 'HIDE'}
      onCancel={onClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={updateLoading} onClick={handleSubmit}>
            确认修改
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editForm} labelCol={{ flex: '120px' }}>
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
      </Form>
    </Modal>
  );
}
