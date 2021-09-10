import React, { useState } from 'react';
import { Modal, Form, Select, Checkbox, DatePicker, Input } from 'antd';

interface ICreateOrEditTaskModal {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  task?: any;
}

export default function CreateOrEditTaskModal(props: ICreateOrEditTaskModal) {
  const { visible, setVisible, task } = props;
  const isCreate = task === undefined;
  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title={isCreate ? '新建任务' : '编辑任务'}
      maskClosable={false}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="应用分类">
          <Select />
        </Form.Item>
        <Form.Item label="应用code">
          <Select />
        </Form.Item>
        <Form.Item label="代码分支">
          <Select />
        </Form.Item>
        <Form.Item label="任务项">
          <Checkbox.Group>
            <Checkbox>单元测试</Checkbox>
            <Checkbox>代码扫描</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="过期时间">
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="触发策略">
          <Input placeholder="支持cron语法" />
        </Form.Item>
        <Form.Item label="负责人">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="通知对象">
          <Select />
        </Form.Item>
      </Form>
    </Modal>
  );
}
