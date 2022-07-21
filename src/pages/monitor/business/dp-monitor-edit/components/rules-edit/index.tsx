import React from "react";
import { Button, Drawer, Form, Input, Space } from 'antd'

const { TextArea } = Input;

interface IPros {
  type: string;
  onCancel: () => void;
  onConfirm: () => void;
  visible: boolean;
}

const RulesEdit = (props: IPros) => {
  const { type = 'add', onCancel, onConfirm, visible } = props;
  const [form] = Form.useForm();

  return (
    <Drawer
      className="rulesEdit"
      title={type === 'edit' ? '编辑告警规则' : '新增报警规则'}
      onClose={onCancel}
      visible={visible}
      width={700}
      bodyStyle={{ paddingRight: 0 }}
      maskClosable={false}
      footer={
        <Space>
          <Button type="primary" onClick={onConfirm}>
            确认
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      }
      footerStyle={{ textAlign: 'right' }}
      destroyOnClose
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        <Form.Item label="规则名称" name="name">
          <Input placeholder="请输入"></Input>
        </Form.Item>
        <Form.Item
          label="告警表达式(PromQl)"
          name=""
          rules={[{ required: true, message: '请输入' }]}
        >
          <TextArea
            rows={2}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default RulesEdit;
