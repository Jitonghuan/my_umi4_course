import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Select, message, Input } from 'antd';
import { getRequest } from '@/utils/request';
import { getVersionCheck } from '../../service';
import { useAddApplication, useGetApplicationOption, useQueryEnvList } from '../hook';
export interface DetailProps {
  visable?: boolean;
  productLineOptions: any;
  tabActiveKey: string;
  curProductLine: string;
  curVersion?: string;
  initData?: any;
  queryParams?: any;
  queryComponentList: (paramObj: { componentType: any }) => any;
  onClose: () => any;
  optType?: string;
}

export default function BasicModal(props: DetailProps) {
  const {
    visable,
    productLineOptions,
    onClose,
    queryComponentList,
    tabActiveKey,
    queryParams,
    curProductLine,
    initData,
    curVersion,
    optType,
  } = props;
  const [addLoading, addApplication] = useAddApplication();
  const [appLoading, applicationOptions, getApplicationOption] = useGetApplicationOption();
  const [envListLoading, envDataSource, queryEnvData] = useQueryEnvList();
  const [loading, setLoading] = useState<boolean>(false);
  const [rightInfo, setRightInfo] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form] = Form.useForm();
  const handleSubmit = () => {
    if (type === 'success') {
      form.validateFields().then((params) => {
        let componentName;
        if (!Array.isArray(params.componentName)) {
          componentName = [params.componentName];
        } else {
          componentName = params.componentName;
        }
        addApplication({ ...params, componentName, componentType: tabActiveKey })
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
  const getCheck = async (
    componentName: string,
    componentType: string,
    componentVersion: string,
    productLine: string,
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
    getCheck(formData.componentName, tabActiveKey, formData.componentVersion, formData.productLine);
  };
  useEffect(() => {
    if (Object.keys(initData || {})?.length !== 0) {
      console.log('initData', initData);
      form.setFieldsValue({ ...initData, componentVersion: curVersion });
      if (tabActiveKey === 'app' && optType !== 'comdetailReadOnly') {
        getApplicationOption(initData.componentSourceEnv);
      }

      setIsDisabled(true);
    } else {
      return;
    }
    queryEnvData();
    return () => {
      form.resetFields();
      setType('');
      setIsDisabled(false);
    };
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
        <Form.Item label="环境" name="componentSourceEnv" rules={[{ required: true, message: '请选择环境' }]}>
          <Select style={{ width: 320 }} options={envDataSource} onChange={getEnvCode} disabled={isDisabled}></Select>
        </Form.Item>
        <Form.Item label="产品线" name="productLine" rules={[{ required: true, message: '请选择产品线' }]}>
          <Select style={{ width: 320 }} options={productLineOptions || []} disabled={isDisabled}></Select>
        </Form.Item>
        <Form.Item label="组件名称" name="componentName" rules={[{ required: true, message: '请选择组件名称' }]}>
          <Select style={{ width: 320 }} mode="multiple" options={applicationOptions} disabled={isDisabled}></Select>
        </Form.Item>
        <Form.Item
          label="组件版本"
          name="componentVersion"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入组件版本',
              validateTrigger: 'onBlur',
            },
          ]}
          validateStatus={
            type === 'success' ? 'success' : type === 'begin' ? 'validating' : type === 'error' ? 'error' : 'warning'
          }
          help={type === 'success' ? '版本号检查通过' : type === 'error' ? errorMessage : '等待检查版本号'}
        >
          <Input style={{ width: 320 }} placeholder="请按照 1.0.0 的格式输入版本号！" onBlur={onVersionChange}></Input>
        </Form.Item>
        {/* <Form.Item label="组件描述" name="componentDescription">
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item> */}
      </Form>
    </Modal>
  );
}
