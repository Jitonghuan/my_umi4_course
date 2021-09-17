import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Checkbox, DatePicker, Input, Switch } from 'antd';
import { operateTask } from '../../service';
import { postRequest } from '@/utils/request';

interface ICreateOrEditTaskModal {
  visible: boolean;
  readOnly?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  task?: any;
}

export default function CreateOrEditTaskModal(props: ICreateOrEditTaskModal) {
  const { visible, setVisible, task, readOnly = false } = props;
  const isCreate = task === undefined;
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isCreate) {
      const taskItems = [];
      if (task.utSwitch) taskItems.push('utSwitch');
      if (task.sonarSwitch) taskItems.push('sonarSwitch');
      form.setFieldsValue({ ...task, taskItems });
    } else {
      form.resetFields();
    }
  }, [visible]);

  const handleOk = () => {
    const formData = form.getFieldsValue();

    const requestParams = {
      ...formData,
      utSwitch: formData.taskItems?.includes('utSwitch') ? 1 : 0,
      sonarSwitch: formData.taskItems?.includes('sonarSwitch') ? 1 : 0,
    };

    console.log('requestParams :>> ', requestParams);

    // postRequest(operateTask, {
    //   body: requestParams,
    // });
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      title={isCreate ? '新建任务' : '编辑任务'}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="应用分类" name="categoryCode">
          <Select />
        </Form.Item>
        <Form.Item label="应用code" name="appCode">
          <Select />
        </Form.Item>
        <Form.Item label="代码分支" name="branchName">
          <Select />
        </Form.Item>
        <Form.Item label="任务项" name="taskItems">
          <Checkbox.Group>
            <Checkbox value="utSwitch">单元测试</Checkbox>
            <Checkbox value="sonarSwitch">代码扫描</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="过期时间" name="expireTime">
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="触发策略" name="strategy">
          <Input placeholder="支持cron语法" />
        </Form.Item>
        <Form.Item label="负责人" name="owner">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="钉钉提醒" name="recipient">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
