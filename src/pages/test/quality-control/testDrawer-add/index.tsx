import React from 'react';
import { Drawer, Button, Form, Space, message } from 'antd';
import { renderForm } from '@/components/table-search/form';
import { FormProps } from '@/components/table-search/typing';

interface TestAddProps {
  visible: boolean;
  onClose: () => void;
}

const TestAdd: React.FC<TestAddProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();

  const formOptions: FormProps[] = [
    {
      key: '1',
      type: 'input',
      label: '任务名',
      dataIndex: 'name',
      placeholder: '请输入',
      required: true,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '2',
      type: 'select',
      label: '应用分类',
      dataIndex: 'categoryName',
      // dataIndex: 'categoryCode',
      placeholder: '请输入',
      required: true,
      option: [],
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        console.log(e);
      },
    },
    {
      key: '3',
      type: 'select',
      label: '应用名',
      dataIndex: 'appName',
      placeholder: '请选择',
      required: true,
      option: [],
      onChange: (e: string) => {
        console.log(e);
      },
    },
    {
      key: '4',
      type: 'select',
      label: '分支名',
      dataIndex: 'branchName',
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
  ];

  formOptions.forEach((v) => {
    v.labelCol = { span: 5 };
    v.wrapperCol = { span: 18 };
  });

  const onSubmit = async () => {
    const values = await form.validateFields();
    message.warning('该任务已存在，请到任务列表中搜索');
  };

  return (
    <Drawer
      title="新增任务"
      visible={visible}
      onClose={onClose}
      destroyOnClose
      width={600}
      footer={
        <Space style={{ float: 'right' }}>
          <Button type="primary" onClick={onSubmit}>
            确认
          </Button>
          <Button onClick={onClose}>取消</Button>
        </Space>
      }
    >
      <Form form={form}>{renderForm(formOptions)}</Form>
    </Drawer>
  );
};

export default TestAdd;
