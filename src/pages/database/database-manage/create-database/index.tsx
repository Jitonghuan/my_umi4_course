/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 16:05:29
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-07 17:25:28
 * @FilePath: /fe-matrix/src/pages/database/database-manage/create-database/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button, Select, Input, Row, Tag } from 'antd';
import CreateAccount from '../../account-manage/components/create-account';
import { useCreateSchema, useGetAccountList, useUserOptions } from '../hook';
import './index.less';

export interface MemberEditorProps {
  mode?: EditorMode;
  initData?: any;
  onClose: () => any;
  onSave: () => any;
}

export default function MemberEditor(props: MemberEditorProps) {
  const { mode, initData, onClose, onSave } = props;
  const [createLoading, createSchema] = useCreateSchema();
  const [accountListLoading, accountData, getAccountList] = useGetAccountList();
  const [userOptions] = useUserOptions();
  const [editForm] = Form.useForm<Record<string, string>>();
  const [viewDisabled, seViewDisabled] = useState<boolean>(false);
  const [accountMode, setAccountMode] = useState<EditorMode>('HIDE');

  useEffect(() => {
    if (mode === 'HIDE' || !initData) return;
    getAccountList({ clusterId: 2 });
    return () => {
      seViewDisabled(false);
      editForm.resetFields();
    };
  }, [mode]);
  const handleSubmit = async () => {
    const params = await editForm.validateFields();
    createSchema({ ...params, clusterId: 2, characterset: 'utf8mb4_bin' }).then(() => {
      onSave();
    });
  };

  return (
    <>
      <CreateAccount
        mode={accountMode}
        onClose={() => {
          setAccountMode('HIDE');
        }}
        onSave={() => {
          setAccountMode('HIDE');
          getAccountList({ clusterId: 2 });
        }}
      />
      <Drawer
        width={900}
        title={mode === 'EDIT' ? '编辑数据库' : mode === 'VIEW' ? '查看数据库' : '新增数据库'}
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
          <Form.Item label="数据库(DB)名称" name="name" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={viewDisabled} style={{ width: 520 }} />
          </Form.Item>
          <Form.Item label="支持字符集" name="characterset">
            <Select options={[]} disabled={viewDisabled} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="owner" name="owner" rules={[{ required: true, message: '请选择' }]}>
            <Select options={userOptions} disabled={viewDisabled} style={{ width: 300 }} />
          </Form.Item>
          <Row>
            <Form.Item label="所属账号" name="accountId" rules={[{ required: true, message: '请选择' }]}>
              <Select
                options={accountData}
                disabled={viewDisabled}
                loading={accountListLoading}
                style={{ width: 300 }}
                placeholder="默认可以先不授权"
              />
            </Form.Item>
            <span style={{ marginTop: 4 }}>
              <Tag
                color="geekblue"
                onClick={() => {
                  setAccountMode('ADD');
                }}
              >
                创建新账号
              </Tag>
            </span>
          </Row>

          <Form.Item label="备注说明" name="description">
            <Input.TextArea style={{ width: 520 }}></Input.TextArea>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
