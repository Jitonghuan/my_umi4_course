import React, { useState, useEffect } from 'react';
import { Form, Button, Select, Input, Modal, message } from 'antd';
import { clusterTypeOption } from '../schema';
import { useUserOptions } from '../../database-manage/hook';
import { useQueryEnvList, addCluster, updateCluster } from '../hook';

export interface ClusterEditorProps {
  mode?: EditorMode;
  curRecord?: any;
  onClose: () => any;
  onSave: () => any;
}

export default function ClusterEditor(props: ClusterEditorProps) {
  const { mode, onClose, onSave, curRecord } = props;
  const [envListLoading, envDataSource, queryEnvData] = useQueryEnvList();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [userOptions] = useUserOptions();
  // const [addLoading, addCluster] = useAddCluster();
  // const [updateLoading, updateCluster] = useUpdateCluster();

  const [editForm] = Form.useForm<Record<string, string>>();
  const [viewDisabled, seViewDisabled] = useState<boolean>(false);
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
    setAddLoading(true);
    const params: any = await editForm.validateFields();
    if (mode === 'ADD') {
      addCluster({ ...params,owner:params?.owner?.join(',') })
        .then((res: any) => {
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
      updateCluster({ ...params, owner:params?.owner?.join(','),id: curRecord?.id })
        .then((res: any) => {
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
      <Modal
        width={700}
        title={mode === 'EDIT' ? '编辑集群' : mode === 'VIEW' ? '查看集群' : '新增集群'}
        // placement="right"
        visible={mode !== 'HIDE'}
        // onClose={onClose}
        onCancel={onClose}
        maskClosable={false}
        footer={
          <div className="drawer-footer">
            <Button type="primary" loading={addLoading} onClick={handleSubmit} disabled={viewDisabled}>
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
            <Input disabled={mode === 'VIEW'} style={{ width: 360 }} />
          </Form.Item>
          <Form.Item label="所属环境" name="envCode">
            <Select
              options={envDataSource}
              disabled={mode !== 'ADD'}
              loading={envListLoading}
              showSearch
              allowClear
              style={{ width: 300 }}
            />
          </Form.Item>
          <Form.Item label="部署类型" name="clusterType" rules={[{ required: true, message: '请输入' }]}>
            <Select disabled={mode !== 'ADD'} style={{ width: 360 }} options={clusterTypeOption} />
          </Form.Item>
          <Form.Item label="数据管理员" name="owner" rules={[{ required: true, message: '请输入' }]}>
            <Select mode="multiple" disabled={mode !== 'ADD'} allowClear showSearch style={{ width: 360 }} options={userOptions} />
          </Form.Item>

          <Form.Item label="读写地址" name="masterVipHost" rules={[{ required: true, message: '请选择' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 360 }} placeholder="如：10.21.4.10" />
          </Form.Item>

          <Form.Item label="读写地址端口" name="masterVipPort" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="只读地址" name="slaveVipHost" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 360 }} placeholder="如：10.21.4.90" />
          </Form.Item>
          <Form.Item label="只读地址端口" name="slaveVipPort" rules={[{ required: true, message: '请输入' }]}>
            <Input disabled={mode === 'VIEW'} style={{ width: 300 }} />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea style={{ width: 360 }} disabled={mode === 'VIEW'}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
