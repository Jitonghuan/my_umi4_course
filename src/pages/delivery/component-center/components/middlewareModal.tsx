import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Select, message, Popconfirm, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from '@/utils/request';
import { useAddMiddleware, useQueryComponentList } from '../hook';
import { uploadChart } from '../../service';
export interface DetailProps {
  visable?: boolean;
  tabActiveKey: string;
  queryComponentList: (tabActiveKey: any) => any;
  initData?: any;
  onClose: () => any;
  onSave?: () => any;
}

export default function BasicModal(props: DetailProps) {
  const { visable, tabActiveKey, initData, queryComponentList, onClose, onSave } = props;
  const [addLoading, addMiddleware] = useAddMiddleware();
  // const [loading, dataSource, pageInfo, setPageInfo, queryComponentList] = useQueryComponentList();
  const [form] = Form.useForm();
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const uploadApi = () => {
    return postRequest(`${uploadChart}?uploadFile`);
  };
  const Uploadprops: any = {
    name: 'file',
    action: uploadApi,
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
  const handleSubmit = () => {
    const params = form.getFieldsValue();
    addMiddleware({ ...params }).then(() => {
      queryComponentList(tabActiveKey);
      setTimeout(() => {
        onClose();
      }, 200);
    });
  };

  return (
    <Modal
      title="平台组件接入"
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
        <Form.Item label="组件名称" name="componentName" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Select style={{ width: 320 }}></Select>
        </Form.Item>
        <Form.Item label="组件版本" name="componentVersion" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Select style={{ width: 320 }}></Select>
        </Form.Item>

        <Form.Item label="组件描述" name="componentDescription" rules={[{ required: true, message: '请选择应用类型' }]}>
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item>
        <Form.Item
          label="组件导入"
          name="upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          // extra="longgggggggggggggggggggggggggggggggggg"
          rules={[{ required: true, message: '请选择应用类型' }]}
        >
          <Upload name="logo" action="/upload.do" listType="picture" {...Uploadprops}>
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
