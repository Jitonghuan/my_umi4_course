import React, { useState } from 'react';
import { Form, Input, Modal, Radio} from 'antd';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export default function SelectVersion (props: IProps) {
  const { visible, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  async function onOk () {
    const values = await form.validateFields();
    onClose();
  }

  return (
    <Modal
      title="发布hotFix"
      visible={visible}
      confirmLoading={loading}
      onOk={onOk}
      onCancel={onClose}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ flex: '100px' }}>
        <Form.Item label="选择版本" name="version" rules={[{ required: true, message: '请选择版本' }]}>
          <Radio.Group defaultValue="beta">
            <Radio value='beta'>beta测试版本</Radio>
            <Radio value='latest'>正式版本</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="发布描述" name="desc" rules={[{ required: true, message: '请输入' }]}>
          <Input.TextArea placeholder="请输入描述" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
