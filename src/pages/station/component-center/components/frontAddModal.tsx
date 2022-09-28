import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, message, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAddFrontComponent } from '../hook';
import { getRequest } from '@/utils/request';
import { uploadFrontfile, getVersionCheck } from '../../service';
import './basicDataModal.less';
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
  const [addLoading, addFrontdata] = useAddFrontComponent();
  const [filePath, setFilePath] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [rightInfo, setRightInfo] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  useEffect(() => {
    if (Object.keys(initData || {})?.length !== 0) {
      form.setFieldsValue({ ...initData, componentVersion: curVersion });
      setIsDisabled(true);
    }
    return () => {
      setType('');
      form.resetFields();
      setIsDisabled(false);
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
          if (res.success && res.data === 'success') {
            setRightInfo(true);

            setType('success');
          } else if (res.success && res.data !== 'success') {
            setRightInfo(false);
            setErrorMessage(res.data);
            setType('error');
            return;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onVersionChange = (value: any) => {
    let formData = form.getFieldsValue();
    getCheck(formData.componentName, tabActiveKey, formData.componentVersion, '');
  };
  const [form] = Form.useForm();
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const Uploadprops: any = {
    name: 'uploadFile',
    action: uploadFrontfile,
    maxCount: 1,
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        let path = info.file.response.data;
        setFilePath(path);
      }
      if (info.file.status === 'done' && info.file?.response.success) {
        message.success(`${info.file.name} 文件上传成功！`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败！`);
      } else if (info.file?.response?.success === false) {
        message.error(info.file.response?.errorMsg);
      } else if (info.file.status === 'removed') {
        message.warning('上传取消！');
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
    if (type === 'success') {
      form.validateFields().then((params) => {
        addFrontdata({ ...params, componentType: tabActiveKey, filePath })
          .then(() => {
            queryComponentList({ componentType: tabActiveKey, ...queryParams });
          })
          .then(() => {
            onClose();
          });
      });
    } else {
      message.warning('请通过版本号校验再提交！');
    }
  };
  return (
    <Modal
      title="前端资源导入"
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
          <Input style={{ width: 320 }} disabled={isDisabled}></Input>
        </Form.Item>
        <Form.Item
          label="版本"
          name="componentVersion"
          hasFeedback
          validateTrigger="onBlur"
          validateStatus={
            rightInfo && !loading && type === 'success'
              ? 'success'
              : !rightInfo && !loading && type === 'begin'
              ? 'validating'
              : type === 'error'
              ? 'error'
              : 'warning'
          }
          help={type === 'success' ? '版本号检查通过' : type === 'error' ? errorMessage : '等待检查版本号'}
          rules={[{ required: true, message: '请填写前端资源版本！' }]}
        >
          <Input style={{ width: 320 }} placeholder="请按照 1.0.0 的格式输入版本号！" onBlur={onVersionChange}></Input>
        </Form.Item>

        <Form.Item
          label="文件上传"
          name="upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: '请上传基础数据！' }]}
        >
          <Upload name="logo" accept=".tgz" action="/upload.do" {...Uploadprops}>
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="描述"
          name="componentDescription"
          rules={[{ required: true, message: '请填写描述！' }]}
        >
          <Input.TextArea style={{ width: 320 }} disabled={isDisabled}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
