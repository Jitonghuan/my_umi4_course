import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, Button, Space, Modal } from 'antd';
import { omit } from 'lodash';
import { history } from 'umi';
import 'codemirror/lib/codemirror.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import FELayout from '@cffe/vc-layout';
import { renderForm } from '@/components/table-search/form';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import usePublicData from '@/utils/usePublicData';
import useRequest from '@/utils/useRequest';
import JsonEditor from '@/components/JsonEditor';
import { queryDataFactoryName, createDataFactory } from '../../service';
import { Item } from '../../typing';

const { confirm } = Modal;

const DataFactoryAdd: React.FC = () => {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [factoryName, setFactoryName] = useState('');
  const [form] = Form.useForm();

  const { envListType, appTypeData } = usePublicData({
    isUseAppEnv: false,
    isUseAppBranch: false,
    isUseAppLists: false,
    isEnvType: true,
  });

  // 获取数据工厂名称
  const { data: factoryNameData, run: queryDataFactoryNameFun } = useRequest({
    api: queryDataFactoryName,
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

  //创建数据
  const { data: dataFactory = [], run: createDataFactoryFun } = useRequest({
    api: createDataFactory,
    method: 'POST',
  });

  const formOptionsLeft: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '项目',
      dataIndex: 'project',
      placeholder: '请选择',
      required: true,
      option: appTypeData,
      onChange: (e) => {
        queryDataFactoryNameFun({ project: e });
      },
    },
    {
      key: '2',
      type: 'select',
      label: '数据工厂名称',
      dataIndex: 'factoryName',
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
      dataIndex: 'env',
      placeholder: '请选择',
      required: true,
      option: envListType,
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'inputNumber',
      label: '数量',
      dataIndex: 'num',
      placeholder: '请输入(1-10的数字)',
      required: true,
      min: 1,
      max: 10,
      width: '100%',
      rules: [
        {
          required: true,
          message: '请输入正确的数字',
        },
      ],
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
    const params = JSON.parse(values.params ?? '{}');
    const id =
      (factoryNameData as Item[])?.find((v) => v.name === factoryName)?.id ??
      '';
    secondConfirm(values, id, params);
    // createDataFactoryFun({
    //   ...omit(values, ['returnData']),
    //   factoryId: id,
    //   params,
    //   createUser: userInfo?.userName,
    // });
  };

  //二次确认
  const secondConfirm = (
    values: Record<string, any>,
    id: React.Key,
    params: Record<string, any>[] | Record<string, any>,
  ) => {
    confirm({
      title: '确定要创建吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        createDataFactoryFun({
          ...omit(values, ['returnData']),
          factoryId: id,
          params,
          createUser: userInfo?.userName,
        });
      },
    });
  };

  useEffect(() => {
    if (!factoryNameData) return;
    form.setFieldsValue({
      params: JSON.stringify(
        (factoryNameData as Item[])?.find((v) => v.name === factoryName)
          ?.params,
      ),
    });
  }, [factoryNameData, factoryName]);

  useEffect(() => {
    if (dataFactory.length === 0) return;
    form.setFieldsValue({
      returnData: JSON.stringify(dataFactory),
    });
  }, [dataFactory]);

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
            <Button onClick={() => history.goBack()}>取消</Button>
          </Space>
        </div>
      </ContentCard>
    </MatrixPageContent>
  );
};

export default DataFactoryAdd;
