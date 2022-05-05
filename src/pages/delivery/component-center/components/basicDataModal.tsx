import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Select, message, Popconfirm, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAddBasicdata, useQueryComponentList } from '../hook';
import { uploadSqlfile } from '../../service';
export interface DetailProps {
  visable?: boolean;
  tabActiveKey: string;
  queryComponentList: (tabActiveKey: any) => any;
  initData?: any;
  onClose: () => any;
}

export default function BasicModal(props: DetailProps) {
  const { visable, tabActiveKey, onClose, queryComponentList } = props;
  const [loading, addBasicdata] = useAddBasicdata();
  const [filePath, setFilePath] = useState<string>('');
  // const [loading, dataSource, pageInfo, setPageInfo, queryComponentList] = useQueryComponentList();

  const [form] = Form.useForm();
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const Uploadprops: any = {
    name: 'uploadFile',
    action: uploadSqlfile,
    // headers: {
    //   authorization: 'authorization-text',
    // },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        let path = info.file.response.data;
        setFilePath(path);
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
    form.validateFields().then((params) => {
      addBasicdata({ ...params, componentType: tabActiveKey, filePath })
        .then(() => {
          queryComponentList(tabActiveKey);
        })
        .then(() => {
          onClose();
        });
    });
  };

  return (
    <Modal
      title="中间件组件接入"
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
        <Form.Item label="名称" name="componentName" rules={[{ required: true, message: '请填写名称' }]}>
          <Input style={{ width: 320 }}></Input>
        </Form.Item>
        <Form.Item
          label="基础数据版本"
          name="componentVersion"
          rules={[{ required: true, message: '请填写基础数据版本！' }]}
        >
          <Input style={{ width: 320 }}></Input>
        </Form.Item>

        <Form.Item
          label="基础数据上传"
          name="upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: '请上传基础数据！' }]}
        >
          <Upload name="logo" action="/upload.do" {...Uploadprops}>
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="基础数据描述" name="componentDescription">
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
