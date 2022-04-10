import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Select, message, Popconfirm, Input } from 'antd';
import { useAddApplication, useQueryComponentList, useGetApplicationOption, useQueryEnvList } from '../hook';
export interface DetailProps {
  visable?: boolean;
  productLineOptions: any;
  tabActiveKey: string;
  queryComponentList: (tabActiveKey: any) => any;
  onClose: () => any;
  initData?: any;
  onSave?: () => any;
}

export default function BasicModal(props: DetailProps) {
  const { visable, productLineOptions, initData, onClose, queryComponentList, onSave, tabActiveKey } = props;
  const [loading, addApplication] = useAddApplication();
  const [appLoading, applicationOptions, getApplicationOption] = useGetApplicationOption();
  const [envListLoading, envDataSource, queryEnvData] = useQueryEnvList();
  // const [loading, dataSource, pageInfo, setPageInfo, queryComponentList] = useQueryComponentList();
  const [form] = Form.useForm();
  const handleSubmit = () => {
    const params = form.getFieldsValue();
    addApplication({ ...params, componentType: tabActiveKey }).then(() => {
      queryComponentList(tabActiveKey);
      setTimeout(() => {
        onClose();
      }, 200);
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
        <Button type="primary" onClick={handleSubmit}>
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
        <Form.Item label="生产线" name="productLine" rules={[{ required: true, message: '请选择生产线' }]}>
          <Select style={{ width: 320 }} options={productLineOptions}></Select>
        </Form.Item>
        <Form.Item label="组件名称" name="componentName" rules={[{ required: true, message: '请选择组件名称' }]}>
          <Select style={{ width: 320 }} mode="multiple" options={applicationOptions}></Select>
        </Form.Item>
        <Form.Item label="组件版本" name="componentVersion" rules={[{ required: true, message: '请输入组件版本' }]}>
          <Input style={{ width: 320 }}></Input>
        </Form.Item>
        <Form.Item label="组件描述" name="componentDescription" rules={[{ required: true, message: '请输入组件描述' }]}>
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
