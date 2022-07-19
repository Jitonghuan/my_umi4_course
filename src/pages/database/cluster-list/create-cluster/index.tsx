import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, message, Form, Button, Select, Input, Row, Tag } from 'antd';
import { clusterTypeOption } from '../schema';
import { useQueryEnvList, useAddCluster, useUpdateCluster } from '../hook';

export interface MemberEditorProps {
  mode?: EditorMode;
  curRecord: any;
  onClose: () => any;
  onSave: () => any;
}

export default function MemberEditor(props: MemberEditorProps) {
  const { mode, onClose, onSave, curRecord } = props;
  const [envListLoading, envDataSource, queryEnvData] = useQueryEnvList();
  const [addLoading, addCluster] = useAddCluster();
  const [updateLoading, updateCluster] = useUpdateCluster();

  const [editForm] = Form.useForm<Record<string, string>>();
  const [viewDisabled, seViewDisabled] = useState<boolean>(false);
  const [accountMode, setAccountMode] = useState<EditorMode>('HIDE');
  //   const [addLoading, addInstance] = useAddInstance();

  useEffect(() => {
    if (mode === 'HIDE') return;
    // getClusterList()
    queryEnvData();
    if (mode !== 'ADD') {
      editForm.setFieldsValue({
        ...curRecord,
      });
    }

    return () => {
      seViewDisabled(false);
      editForm.resetFields();
    };
  }, [mode]);
  const handleSubmit = async () => {
    const params: any = await editForm.validateFields();
    if (mode === 'ADD') {
      addCluster({ ...params }).then(() => {
        onSave();
      });
    }
    if (mode === 'EDIT') {
      updateCluster({ ...params, id: curRecord?.id }).then(() => {
        onSave();
      });
    }
  };

  return (
    <>
      <Drawer
        width={900}
        title={mode === 'EDIT' ? '编辑集群' : mode === 'VIEW' ? '查看集群' : '新增集群'}
        placement="right"
        visible={mode !== 'HIDE'}
        onClose={onClose}
        maskClosable={false}
        footer={
          <div className="drawer-footer">
            <Button type="primary" loading={updateLoading || addLoading} onClick={handleSubmit} disabled={viewDisabled}>
              保存
            </Button>
            <Button type="default" onClick={onClose}>
              取消
            </Button>
          </div>
        }
      >
        <Form form={editForm} labelCol={{ flex: '120px' }}>
          <Form.Item label="集群名称" name="name" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 520 }} />
          </Form.Item>
          <Form.Item label="所属环境" name="instanceType">
            <Select
              options={envDataSource}
              disabled={mode !== 'ADD'}
              loading={envListLoading}
              showSearch
              allowClear
              style={{ width: 300 }}
            />
          </Form.Item>
          <Form.Item label="部署类型" name="instanceVersion" rules={[{ required: true, message: '请输入' }]}>
            <Select disabled={mode !== 'ADD'} style={{ width: 520 }} options={clusterTypeOption} />
          </Form.Item>

          <Form.Item label="读写地址" name="clusterId" rules={[{ required: true, message: '请选择' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 300 }} placeholder="如：10.21.4.10" />
          </Form.Item>

          <Form.Item label="读写地址端口" name="instanceHost" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 520 }} />
          </Form.Item>
          <Form.Item label="只读地址" name="instancePort" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 520 }} placeholder="如：10.21.4.90" />
          </Form.Item>
          <Form.Item label="只读地址端口" name="manageUser" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 520 }} />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea style={{ width: 520 }} disabled={mode === 'VIEW'}></Input.TextArea>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
