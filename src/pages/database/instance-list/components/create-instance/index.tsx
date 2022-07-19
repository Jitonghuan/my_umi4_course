import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button, Select, Input, Row, Tag } from 'antd';
import { useAddInstance, useUpdateInstance } from '../../hook';
import { instanceTypeOption, roleTypeOption } from '../../schema';
import { useGetClusterList } from '../../hook';
import { INSTANCE_TYPE } from '../../schema';

import './index.less';

export interface MemberEditorProps {
  mode?: EditorMode;
  curRecord?: any;
  onClose: () => any;
  onSave: () => any;
}

export default function MemberEditor(props: MemberEditorProps) {
  const { mode, onClose, onSave, curRecord } = props;
  const [loading, clusterOptions, getClusterList] = useGetClusterList();
  const [editForm] = Form.useForm<Record<string, string>>();
  const [addLoading, addInstance] = useAddInstance();
  const [updateLoading, updateInstance] = useUpdateInstance();

  useEffect(() => {
    if (mode === 'HIDE') return;
    getClusterList();
    if (mode !== 'ADD') {
      editForm.setFieldsValue({
        ...curRecord,
      });
    }

    return () => {
      editForm.resetFields();
    };
  }, [mode]);
  const handleSubmit = async () => {
    const params: any = await editForm.validateFields();
    if (mode === 'ADD') {
      addInstance({ ...params }).then(() => {
        onSave();
      });
    }
    if (mode === 'EDIT') {
      updateInstance({ ...params, id: curRecord.id }).then(() => {
        onSave();
      });
    }
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
            <Button
              type="primary"
              loading={updateLoading || addLoading}
              onClick={handleSubmit}
              disabled={mode === 'VIEW'}
            >
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
            <Input disabled={mode === 'VIEW'} style={{ width: 520 }} />
          </Form.Item>
          <Form.Item label="数据库类型" name="instanceType">
            <Select options={instanceTypeOption} disabled={mode !== 'ADD'} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="数据库版本" name="instanceVersion" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode !== 'ADD'} style={{ width: 520 }} />
          </Form.Item>

          <Row>
            <Form.Item label="所属集群" name="clusterId" rules={[{ required: true, message: '请选择' }]}>
              <Select
                loading={loading}
                allowClear
                showSearch
                options={clusterOptions}
                disabled={mode !== 'ADD'}
                style={{ width: 300 }}
                placeholder="默认可以先不授权"
              />
            </Form.Item>
            {mode === 'ADD' && (
              <span style={{ marginTop: 4 }}>
                <Tag color="geekblue" onClick={() => {}}>
                  新增集群
                </Tag>
              </span>
            )}
          </Row>
          <Form.Item label="集群角色" name="clusterRole" rules={[{ required: true, message: '请选择' }]}>
            <Select options={roleTypeOption} disabled={mode !== 'ADD'} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="实例地址" name="instanceHost" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 520 }} placeholder="格式如：192.168.0.1" />
          </Form.Item>
          <Form.Item label="端口" name="instancePort" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 520 }} />
          </Form.Item>
          <Form.Item label="数据库账号" name="manageUser" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 520 }} />
          </Form.Item>
          <Form.Item label="数据库密码" name="managePassword" rules={[{ required: true, message: '请输入' }]}>
            <Input.Password disabled={mode === 'VIEW'} style={{ width: 520 }} />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea style={{ width: 520 }}></Input.TextArea>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
