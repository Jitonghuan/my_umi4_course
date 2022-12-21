import React, { useState, useEffect } from 'react';
import { Drawer, Form, Button, Select, Input, Row, Tag, message } from 'antd';
import { addInstance, updateInstance } from '../../hook';
import { instanceTypeOption, roleTypeOption } from '../../schema';
import { useGetClusterList } from '../../hook';
import CreateCluster from '../../../cluster-list/create-cluster';
import './index.less';

export interface CreateInstanceProps {
  mode?: EditorMode;
  curRecord?: any;
  onClose: () => any;
  onSave: () => any;
}

export default function CreateInstance(props: CreateInstanceProps) {
  const { mode, onClose, onSave, curRecord } = props;
  const [loading, clusterOptions, getClusterList] = useGetClusterList();
  const [editForm] = Form.useForm<Record<string, string>>();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [clusterMode, setClusterMode] = useState<EditorMode>('HIDE');

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
    setAddLoading(true);
    const params: any = await editForm.validateFields();
    if (mode === 'ADD') {
      addInstance({ ...params })
        .then((res) => {
          if (res?.code === 1000) {
            message.success(res.data);
            onSave();
          }
        })
        .finally(() => {
          setAddLoading(false);
        });
    }
    if (mode === 'EDIT') {
      updateInstance({ ...params, id: curRecord.id })
        .then((res) => {
          if (res?.code === 1000) {
            message.success(res.data);
            onSave();
          }
        })
        .finally(() => {
          setAddLoading(false);
        });
    }
  };

  return (
    <>
      <CreateCluster
        mode={clusterMode}
        onClose={() => {
          setClusterMode('HIDE');
        }}
        onSave={() => {
          setClusterMode('HIDE');
          getClusterList();
        }}
      />
      <Drawer
        width={700}
        title={mode === 'EDIT' ? '编辑实例' : mode === 'VIEW' ? '查看实例' : '新接入实例'}
        placement="right"
        visible={mode !== 'HIDE'}
        onClose={onClose}
        maskClosable={false}
        footer={
          <div className="drawer-footer">
            <Button type="primary" loading={addLoading} onClick={handleSubmit} disabled={mode === 'VIEW'}>
              保存
            </Button>
            <Button type="default" onClick={onClose}>
              取消
            </Button>
          </div>
        }
      >
        <div className="recordAdd">
          <Form form={editForm} labelCol={{ flex: '120px' }}>
            <Form.Item label="实例名称" name="name" rules={[{ required: true, message: '请输入' }]}>
              <Input disabled={mode === 'VIEW'} style={{ width: 360 }} />
            </Form.Item>
            <Form.Item label="数据库类型" name="instanceType" rules={[{ required: true, message: '请输入' }]}>
              <Select options={instanceTypeOption} disabled={mode !== 'ADD'} style={{ width: 360 }} />
            </Form.Item>
            {/* <Form.Item label="数据库版本" name="instanceVersion" rules={[{ required: true, message: '请输入' }]}>
              <Input disabled={mode !== 'ADD'} style={{ width: 360 }} />
            </Form.Item> */}

            <Row className="row-layout" style={{ width: '100%' }}>
              <Form.Item
                style={{ width: '60%' }}
                label="所属集群"
                name="clusterId"
                rules={[{ required: true, message: '请选择' }]}
              >
                <Select
                  loading={loading}
                  allowClear
                  showSearch
                  options={clusterOptions}
                  // disabled={mode !== 'ADD'}
                  // style={{ width: 360 }}
                  placeholder="请选择"
                />
              </Form.Item>
              {mode === 'ADD' && (
                <span style={{ marginTop: 4 }}>
                  <Tag
                    color="geekblue"
                    onClick={() => {
                      setClusterMode('ADD');
                    }}
                  >
                    新增集群
                  </Tag>
                </span>
              )}
            </Row>
            <Form.Item label="集群角色" name="clusterRole" rules={[{ required: true, message: '请选择' }]}>
              <Select options={roleTypeOption} disabled={mode !== 'ADD'} style={{ width: 360 }} />
            </Form.Item>
            <Form.Item label="实例地址" name="instanceHost" rules={[{ required: true, message: '请输入' }]}>
              <Input disabled={mode === 'VIEW'} style={{ width: 360 }} placeholder="格式如：192.168.0.1" />
            </Form.Item>
            <Form.Item label="端口" name="instancePort" rules={[{ required: true, message: '请输入' }]}>
              <Input disabled={mode === 'VIEW'} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="数据库账号" name="manageUser" rules={[{ required: true, message: '请输入' }]}>
              <Input disabled={mode === 'VIEW'} style={{ width: 360 }} />
            </Form.Item>
            <Form.Item label="数据库密码" name="managePassword" rules={[{ required: true, message: '请输入' }]}>
              <Input.Password disabled={mode === 'VIEW'} style={{ width: 360 }} />
            </Form.Item>

            <Form.Item label="描述" name="description">
              <Input.TextArea style={{ width: 360 }}></Input.TextArea>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </>
  );
}
