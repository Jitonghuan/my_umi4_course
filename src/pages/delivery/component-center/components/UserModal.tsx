import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Select, message, Popconfirm, Input } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import { getVersionCheck } from '../../service';
import { useAddApplication, useQueryComponentList, useGetApplicationOption, useQueryEnvList } from '../hook';
export interface DetailProps {
  visable?: boolean;
  productLineOptions: any;
  tabActiveKey: string;
  curProductLine: string;
  queryComponentList: (tabActiveKey: any) => any;
  onClose: () => any;
}

export default function BasicModal(props: DetailProps) {
  const { visable, productLineOptions, onClose, queryComponentList, tabActiveKey, curProductLine } = props;
  const [addLoading, addApplication] = useAddApplication();
  const [appLoading, applicationOptions, getApplicationOption] = useGetApplicationOption();
  const [envListLoading, envDataSource, queryEnvData] = useQueryEnvList();
  const [loading, setLoading] = useState<boolean>(false);
  const [rightInfo, setRightInfo] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
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
  const getCheck = async (componentVersion: string, productLine: string) => {
    setLoading(true);
    setType('begin');
    try {
      await getRequest(`${getVersionCheck}?componentVersion=${componentVersion}&productLine=${productLine}`)
        .then((res) => {
          if (res.success) {
            // message.success(res.data);
            setRightInfo(true);
            setType('success');
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
    console.log('value', formData.componentVersion);
    getCheck(formData.componentVersion, curProductLine);
  };
  useEffect(() => {
    queryEnvData();
    return () => {
      setType('');
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
          <Select style={{ width: 320 }} options={envDataSource} onChange={getEnvCode}></Select>
        </Form.Item>
        <Form.Item label="产品线" name="productLine" rules={[{ required: true, message: '请选择产品线' }]}>
          <Select style={{ width: 320 }} options={productLineOptions || []}></Select>
        </Form.Item>
        <Form.Item label="组件名称" name="componentName" rules={[{ required: true, message: '请选择组件名称' }]}>
          <Select style={{ width: 320 }} mode="multiple" options={applicationOptions}></Select>
        </Form.Item>
        <Form.Item
          label="组件版本"
          name="componentVersion"
          hasFeedback
          // validateStatus={
          // rightInfo && !loading && type === 'success'
          //   ? 'success'
          //   : !rightInfo && !loading && type === 'begin'
          //   ? 'validating'
          //   : type === 'error'
          //   ? 'error'
          //   : 'warning'
          // }
          validateStatus={
            type === 'success' ? 'success' : type === 'begin' ? 'validating' : type === 'error' ? 'error' : 'warning'
          }
          help={type === 'sucess' ? '版本号检查通过' : type === 'error' ? '版本号检查不通过' : '等待检查版本号'}
          rules={[{ required: true, message: '请输入组件版本' }]}
        >
          <Input
            style={{ width: 320 }}
            placeholder="请按照 1.0.0 的格式输入版本号！"
            onChange={onVersionChange}
          ></Input>
        </Form.Item>
        <Form.Item label="组件描述" name="componentDescription">
          <Input.TextArea style={{ width: 320 }}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
