import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Select, message, Popconfirm, Input } from 'antd';
export interface DetailProps {
  visable?: boolean;
  initData?: any;
  onClose?: () => any;
  onSave?: () => any;
}

export default function BasicModal(props: DetailProps) {
  const { visable, initData, onClose, onSave } = props;
  const [form] = Form.useForm();
  return (
    <Modal
      title="用户组件接入"
      visible={visable}
      // onCancel={handleCancel}
      // closable={!loading}
      width={580}
      footer={[<Button type="primary">确认</Button>, <Button>取消</Button>]}
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        <Form.Item label="环境" name="envCode" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Select style={{ width: 320 }}></Select>
        </Form.Item>
        <Form.Item label="组件名称" name="comPonentName" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Select style={{ width: 320 }}></Select>
        </Form.Item>
        <Form.Item label="环境" name="envCode" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Input style={{ width: 320 }}></Input>
        </Form.Item>
        <Form.Item label="环境" name="envCode" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
