//创建制品
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Select, message, Popconfirm, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
export interface ProductListProps {
  visable?: boolean;
  initData?: any;
  onClose?: () => any;
  onSave?: () => any;
}

export default function CreateProductModal(props: ProductListProps) {
  const { visable, initData, onClose, onSave } = props;

  const [form] = Form.useForm();
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const Uploadprops: any = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
    },
  };
  return (
    <Modal
      title="创建制品"
      visible={visable}
      // onCancel={handleCancel}
      // closable={!loading}
      width={580}
      footer={[<Button type="primary">确认</Button>, <Button>取消</Button>]}
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        <Form.Item label="制品名称" name="envCode" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Input style={{ width: 320 }}></Input>
        </Form.Item>
        <Form.Item label="交付项目" name="comPonentName" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Input style={{ width: 320 }}></Input>
        </Form.Item>

        <Form.Item label="制品描述" name="envCode" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item>
        <Form.Item label="交付产品" name="envCode" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Select style={{ width: 320 }}></Select>
        </Form.Item>
        <Form.Item label="产品版本" name="envCode" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Select style={{ width: 320 }}></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
