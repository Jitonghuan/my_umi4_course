import React, { useContext, useState } from 'react';
import { Drawer, Button, Form, Space, message } from 'antd';
import FELayout from '@cffe/vc-layout';
import { renderForm } from '@/components/table-search/form';
import { FormProps } from '@/components/table-search/typing';
import { getRequest, postRequest } from '@/utils/request';
import usePublicData from '@/utils/usePublicData';
import { createQCTask } from '../../service';

interface TestAddProps {
  visible: boolean;
  onClose: () => void;
}

const TestAdd: React.FC<TestAddProps> = ({ visible, onClose }) => {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [form] = Form.useForm();
  const [appCode, setAppCode] = useState<string | undefined>();
  const [appCategoryCode, setAppCategoryCode] = useState<string | undefined>();

  const { appManageListData, appTypeData, appBranchData } = usePublicData({
    appCode,
    appCategoryCode,
  });

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
      dataIndex: 'categoryCode',
      placeholder: '请输入',
      required: true,
      option: appTypeData,
      onChange: setAppCategoryCode,
    },
    {
      key: '3',
      type: 'select',
      label: '应用名',
      dataIndex: 'appCode',
      placeholder: '请选择',
      required: true,
      option: appManageListData,
      onChange: setAppCode,
    },
    {
      key: '4',
      type: 'select',
      label: '分支名',
      dataIndex: 'branchName',
      placeholder: '请选择',
      required: true,
      option: appBranchData,
    },
  ];

  formOptions.forEach((v) => {
    v.labelCol = { span: 5 };
    v.wrapperCol = { span: 18 };
  });

  const onSubmit = async () => {
    const values = await form.validateFields();

    await postRequest(createQCTask, {
      data: {
        ...values,
        createUser: userInfo.userName,
      },
    });

    message.success('创建成功');
    onClose();
  };

  return (
    <Drawer
      title="新增任务"
      visible={visible}
      onClose={onClose}
      destroyOnClose
      width={600}
      maskClosable={false}
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
