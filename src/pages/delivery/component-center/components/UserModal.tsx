import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Select, message, Popconfirm, Input } from '@cffe/h2o-design';
import { useAddApplication, useQueryComponentList, useGetApplicationOption, useQueryEnvList } from '../hook';
export interface DetailProps {
  visable?: boolean;
  productLineOptions: any;
  tabActiveKey: string;
  queryComponentList: (tabActiveKey: any) => any;
  onClose: () => any;
}

export default function BasicModal(props: DetailProps) {
  const { visable, productLineOptions, onClose, queryComponentList, tabActiveKey } = props;
  const [loading, addApplication] = useAddApplication();
  const [appLoading, applicationOptions, getApplicationOption] = useGetApplicationOption();
  const [envListLoading, envDataSource, queryEnvData] = useQueryEnvList();
  // const [loading, dataSource, pageInfo, setPageInfo, queryComponentList] = useQueryComponentList();
  const [form] = Form.useForm();
  const handleSubmit = () => {
    // const params = form.getFieldsValue();
    form.validateFields().then((params) => {
      addApplication({ ...params, componentType: tabActiveKey })
        .then(() => {
          queryComponentList(tabActiveKey);
        })
        .then(() => {
          onClose();
        });
    });
  };
  useEffect(() => {
    queryEnvData();
  }, [visable]);
  const getEnvCode = (value: string) => {
    getApplicationOption(value);
  };

  return (
    <Modal
      title="应用组件接入"
      visible={visable}
      onCancel={() => {
        onClose();
      }}
      // closable={!loading}
      width={580}
      footer={[
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          确认
        </Button>,
        <Button
          onClick={() => {
            onClose();
          }}
        >
          取消
        </Button>,
      ]}
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        <Form.Item label="环境" name="componentSourceEnv" rules={[{ required: true, message: '请选择环境' }]}>
          <Select style={{ width: 320 }} options={envDataSource} onChange={getEnvCode}></Select>
        </Form.Item>
        <Form.Item label="产品线" name="productLine" rules={[{ required: true, message: '请选择产品线' }]}>
          <Select style={{ width: 320 }} options={productLineOptions}></Select>
        </Form.Item>
        <Form.Item label="组件名称" name="componentName" rules={[{ required: true, message: '请选择组件名称' }]}>
          <Select style={{ width: 320 }} mode="multiple" options={applicationOptions}></Select>
        </Form.Item>
        <Form.Item label="组件版本" name="componentVersion" rules={[{ required: true, message: '请输入组件版本' }]}>
          <Input style={{ width: 320 }}></Input>
        </Form.Item>
        <Form.Item label="组件描述" name="componentDescription">
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
