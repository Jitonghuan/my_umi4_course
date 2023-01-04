/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-07-07 16:05:29
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-07-12 14:27:09
 * @FilePath: /fe-matrix/src/pages/database/database-manage/create-database/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { Drawer, Form, Button, Select, Input, Row, Tag, message } from 'antd';
import CreateAccount from '../../account-manage/components/create-account';
import { createSchema, useGetAccountList, useUserOptions, useGetCharacterSetList } from '../hook';
import './index.less';

export interface CreateDataBaseProps {
  mode?: EditorMode;
  clusterId: number;
  onClose: () => any;
  onSave: () => any;
}

export default function CreateDataBase(props: CreateDataBaseProps) {
  const { mode, onClose, onSave, clusterId } = props;
  // const [createLoading, createSchema] = useCreateSchema();
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [accountListLoading, accountData, getAccountList] = useGetAccountList();
  const [loading, CharacterSetListOptions, getCharacterSetList] = useGetCharacterSetList();
  const [userOptions] = useUserOptions();
  const [editForm] = Form.useForm();
  const [accountMode, setAccountMode] = useState<EditorMode>('HIDE');

  useEffect(() => {
    if (mode === 'HIDE') return;
    getAccountList({ clusterId });
    getCharacterSetList({ clusterId });

    return () => {
      editForm.resetFields();
    };
  }, [mode]);
  const handleSubmit = async () => {
    const params = await editForm.validateFields();
    setCreateLoading(true);
    createSchema({ ...params, clusterId, characterset: params?.characterset })
      .then((res: any) => {
        if (res?.code === 1000) {
          message.success(res.data);
          onSave();
        }
      })
      .finally(() => {
        setCreateLoading(false);
      });
  };

  return (
    <>
      <CreateAccount
        mode={accountMode}
        clusterId={clusterId}
        onClose={() => {
          setAccountMode('HIDE');
        }}
        onSave={() => {
          setAccountMode('HIDE');
          getAccountList({ clusterId });
        }}
      />
      <Drawer
        width={700}
        title={mode === 'EDIT' ? '编辑数据库' : mode === 'VIEW' ? '查看数据库' : '新增数据库'}
        placement="right"
        visible={mode !== 'HIDE'}
        onClose={onClose}
        maskClosable={false}
        footer={
          <div className="drawer-footer">
            <Button type="primary" loading={createLoading} onClick={handleSubmit}>
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
            <Input style={{ width: 355 }} placeholder="库名名只能包含数字、字母、下划线" />
          </Form.Item>
          <Form.Item label="支持字符集" name="characterset">
            <Select options={CharacterSetListOptions} loading={loading} allowClear showSearch style={{ width: 200 }} />
          </Form.Item>
          {/* <Form.Item label="owner" name="owner" rules={[{ required: true, message: '请选择' }]}>
            <Select options={userOptions} allowClear showSearch style={{ width: 200 }} />
          </Form.Item> */}
          <Row>
            <Form.Item
              style={{ width: '60%' }}
              label="所属账号"
              name="accountId"
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select
                options={accountData}
                loading={accountListLoading}
                // style={{ width: 300 }}
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
            <Input.TextArea style={{ width: 360 }}></Input.TextArea>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
