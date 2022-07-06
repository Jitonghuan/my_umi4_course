import React from 'react';
import { Form, Input, Modal, Radio} from 'antd';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (params: any) => void;
}

export default function SelectVersion (props: IProps) {
  const { visible, onClose, onConfirm } = props;
  const [form] = Form.useForm();

  async function onOk () {
    const values = await form.validateFields();
    onConfirm(values);
  }

  return (
    <Modal
      title="发布"
      visible={visible}
      onOk={onOk}
      width="950px"
      onCancel={onClose}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ flex: '100px' }}>
        <Form.Item label="选择版本" name="versionType" rules={[{ required: true, message: '请选择版本' }]}>
          <Radio.Group defaultValue="minor">
            <Radio value='1'>主版本号(Marjo) <span style={{ color: '#999', fontSize: '14px' }}>breaking change</span></Radio>
            <Radio value='2'>次版本号(Minor) <span style={{ color: '#999', fontSize: '14px' }}>添加或者废弃功能</span></Radio>
            <Radio value='3'>修订号(Patch) <span style={{ color: '#999', fontSize: '14px' }}>bug修复，向下兼容</span></Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="发布描述" name="deployDesc" rules={[{ required: true, message: '请输入' }]}>
          <Input.TextArea placeholder="请输入描述" rows={10} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
