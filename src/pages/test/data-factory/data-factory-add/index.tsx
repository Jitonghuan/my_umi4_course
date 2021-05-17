import React from 'react';
import { Form, Button, Space } from 'antd';
import { renderForm } from '@/components/table-search/form';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import { FormProps } from '@/components/table-search/typing';

const DataFactoryAdd: React.FC = () => {
  const [form] = Form.useForm();

  const formOptionsLeft: FormProps[] = [
    {
      key: '1',
      type: 'select',
      label: '项目',
      dataIndex: 'project',
      placeholder: '请选择',
      required: true,
      option: [],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '数据工厂名称',
      dataIndex: 'status',
      placeholder: '请选择',
      required: true,
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '环境',
      dataIndex: 'environment',
      placeholder: '请选择',
      required: true,
      option: [
        {
          key: 1,
          value: '1',
        },
        {
          key: 2,
          value: '2',
        },
        {
          key: 3,
          value: '3',
        },
      ],
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
      type: 'area',
      label: '参数示例',
      // dataIndex: 'example',
      placeholder: '请输入',
      autoSize: { minRows: 17 },
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
      type: 'area',
      label: '返回数据',
      dataIndex: 'returnData',
      placeholder: '请输入json格式的数据',
      autoSize: { minRows: 25 },
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      // rules: [{
      //   required: true,
      //   message: '请输入正确的数据',
      //   // pattern: /^\{(\n|\s)+[\w:\w,]+\}$/,
      // }],
      onChange: (e) => {
        console.log(e.target.value);
      },
    },
  ];

  const onSubmit = async () => {
    const values = await form.validateFields();
  };

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
