import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Select, message, Popconfirm, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAddBasicdata, useGetVersionCheck } from '../hook';
import { getRequest, postRequest } from '@/utils/request';
import { uploadSqlfile, getVersionCheck } from '../../service';
export interface DetailProps {
  visable?: boolean;
  tabActiveKey: string;
  curProductLine: string;
  curVersion?: string;
  queryParams?: any;
  queryComponentList: (paramObj: { componentType: any }) => any;
  initData?: any;
  onClose: () => any;
}

export default function BasicModal(props: DetailProps) {
  const { visable, tabActiveKey, onClose, queryComponentList, queryParams, curProductLine, curVersion, initData } =
    props;
  const [addLoading, addBasicdata] = useAddBasicdata();
  const [filePath, setFilePath] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [rightInfo, setRightInfo] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  // const [checkLoading,rightInfo, getVersionCheck]=useGetVersionCheck();
  useEffect(() => {
    if (Object.keys(initData || {})?.length !== 0) {
      form.setFieldsValue({ ...initData, componentVersion: curVersion });
    }
    return () => {
      setType('');
      form.resetFields();
    };
  }, [visable]);
  const getCheck = async (
    componentName: string,
    componentType: string,
    componentVersion: string,
    productLine?: string,
  ) => {
    setLoading(true);
    setType('begin');
    try {
      await getRequest(
        `${getVersionCheck}?componentName=${componentName}&componentType=${componentType}&componentVersion=${componentVersion}&productLine=${productLine}`,
      )
        .then((res) => {
          if (res.success) {
            // message.success(res.data);
            setRightInfo(true);
            setType('sucess');
          } else {
            setRightInfo(false);
            setType('error');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
          // setType('end');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onVersionChange = (value: any) => {
    let formData = form.getFieldsValue();
    console.log('value', value);
    getCheck(formData.componentName, tabActiveKey, formData.componentVersion, '');
  };
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
    maxCount: 1,
    // headers: {
    //   authorization: 'authorization-text',
    // },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        let path = info.file.response.data;
        setFilePath(path);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功！`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败！`);
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
          queryComponentList({ componentType: tabActiveKey, ...queryParams });
        })
        .then(() => {
          onClose();
        });
    });
  };
  return (
    <Modal
      title="基础数据导入"
      visible={visable}
      onCancel={() => {
        onClose();
      }}
      // closable={!loading}
      width={580}
      footer={[
        <Button type="primary" onClick={handleSubmit} loading={addLoading}>
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
          hasFeedback
          validateTrigger="onBlur"
          validateStatus={
            rightInfo && !loading && type === 'sucess'
              ? 'success'
              : !rightInfo && !loading && type === 'begin'
              ? 'validating'
              : type === 'error'
              ? 'error'
              : 'warning'
          }
          help={type === 'success' ? '版本号检查通过' : type === 'error' ? '版本号检查不通过' : '等待检查版本号'}
          rules={[{ required: true, message: '请填写基础数据版本！' }]}
        >
          <Input style={{ width: 320 }} placeholder="请按照 1.0.0 的格式输入版本号！" onBlur={onVersionChange}></Input>
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
        <Form.Item
          label="基础数据描述"
          name="componentDescription"
          rules={[{ required: true, message: '请填写描述！' }]}
        >
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
