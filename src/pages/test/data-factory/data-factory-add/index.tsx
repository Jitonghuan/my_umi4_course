import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Button, Space } from 'antd';
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import FELayout from '@cffe/vc-layout';
import { renderForm } from '@/components/table-search/form';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import usePublicData from '@/utils/usePublicData';
import useRequest from '@/utils/useRequest';
import JsonEditor from '@/components/JsonEditor';
import { queryDataFactoryName } from '../../service';
import { Item } from '../../typing';

const DataFactoryAdd: React.FC = () => {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [appCode, setAppCode] = useState('');
  const [factoryName, setFactoryName] = useState('');
  const [form] = Form.useForm();

  const { appManageEnvData, appManageListData } = usePublicData({
    appCode,
    isUseAppEnv: true,
  });

  const { data: factoryNameData, run: queryDataFactoryNameFun } = useRequest({
    // api: queryDataFactoryName,
    api:
      'http://turing.cfuture.shop:8010/v1/qc/dataFactory/queryDataFactory?project=hbos',
    method: 'GET',
    formatData: (data = []) => {
      return data?.map((v: any) => {
        return {
          ...v,
          key: v.name,
          value: v.name,
        };
      });
    },
  });

  const formOptionsLeft: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '项目',
      dataIndex: 'project',
      placeholder: '请选择',
      required: true,
      option: appManageListData,
      onChange: (e) => {
        setAppCode(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '数据工厂名称',
      dataIndex: 'status',
      placeholder: '请选择',
      required: true,
      option: factoryNameData as OptionProps[],
      onChange: (e: string) => {
        setFactoryName(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '环境',
      dataIndex: 'environment',
      placeholder: '请选择',
      required: true,
      option: appManageEnvData,
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'input',
      label: '数量',
      dataIndex: 'number',
      placeholder: '请输入',
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '5',
      type: 'other',
      label: '参数示例',
      // dataIndex: 'params',
      placeholder: '请输入',
      autoSize: { minRows: 17 },
      extraForm: (
        <Form.Item noStyle name="params">
          <JsonEditor
            style={{ minHeight: 300 }}
            options={{ placeholder: '参数实例' }}
          />
        </Form.Item>
      ),
      onChange: (e: string) => {
        console.log(e);
      },
    },
  ];

  formOptionsLeft.forEach((v) => {
    v.itemStyle = { width: '100%' };
    v.labelCol = { span: 5 };
    v.wrapperCol = { span: 18 };
  });

  const formOptionsRight: FormProps[] = [
    {
      key: '1',
      type: 'other',
      label: '返回数据',
      autoSize: { minRows: 25 },
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      rules: [],
      extraForm: (
        <Form.Item noStyle name="returnData">
          <JsonEditor
            style={{ minHeight: 300 }}
            options={{ readOnly: true, placeholder: '返回数据' }}
          />
        </Form.Item>
      ),
      onChange: (e) => {
        console.log(e.target.value);
      },
    },
  ];

  const onSubmit = async () => {
    const values = await form.validateFields();
  };

  useEffect(() => {
    queryDataFactoryNameFun();
  }, []);

  useEffect(() => {
    if (!factoryNameData) return;
    form.setFieldsValue({
      params: JSON.stringify(
        (factoryNameData as Item[])?.find((v) => v.name === factoryName)
          ?.params,
      ),
    });
  }, [factoryNameData, factoryName]);

  return (
    <MatrixPageContent>
      <ContentCard
        bodyStyle={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Form form={form} style={{ display: 'flex' }}>
          <div style={{ width: '50%' }}>{renderForm(formOptionsLeft)}</div>
          <div style={{ width: '50%' }}>{renderForm(formOptionsRight)}</div>
        </Form>
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button type="primary" onClick={onSubmit}>
              立即创建
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
              }}
            >
              重置
            </Button>
          </Space>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
};

export default DataFactoryAdd;
