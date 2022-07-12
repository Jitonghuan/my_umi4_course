import React, { useEffect } from 'react';
import { Form, Input, Modal, Radio} from 'antd';

interface IProps {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
}

export default function SelectVersion (props: IProps) {
  const { visible, loading, onClose, onConfirm } = props;
  const [form] = Form.useForm();

  async function onOk () {
    const values = await form.validateFields();
    onConfirm(values);
  }

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

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
        <Form.Item label="选择版本" name="versionType" rules={[{ required: true, message: '请选择版本' }]}>
          <Radio.Group defaultValue="beta">
            <Radio value={4}>beta测试版本</Radio>
            <Radio value={5}>正式版本</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="发布描述" name="deployDesc" rules={[{ required: true, message: '请输入' }]}>
          <Input.TextArea placeholder="请输入描述" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
