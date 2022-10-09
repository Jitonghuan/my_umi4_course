// 编辑参数
// @author JITONGHUAN <muxi@come-future.com>
// @create 2022/04/26 14:12

import { useEffect } from 'react';
import { Modal, Input, Form } from 'antd';
import { useSaveIndentParam } from '../../../hook';

export interface IProps {
  visible: boolean;
  initData: any;
  type: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function EditorModal(props: IProps) {
  const { visible, type, initData, onClose, onSubmit } = props;
  const [saveLoading, saveIndentParam] = useSaveIndentParam();
  const [form] = Form.useForm();
  const handleSubmit = async () => {
    const values = await form.validateFields();
    saveIndentParam(initData.id, values.paramValue).then(() => {
      onSubmit();
    });
  };

  useEffect(() => {
    if (!visible) return;
    if (initData) {
      form.setFieldsValue({ ...initData });
    }
    return () => {
      form.resetFields();
    };
  }, [visible, type]);

  return (
    <Modal
      destroyOnClose
      width={800}
      title={type === 'config' ? '编辑全局建站可变参数值' :type === 'compontent'? '编辑组件建站态可变参数值':"编辑服务配置可变参数值"}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={saveLoading}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        {type !== 'config' && (
          <Form.Item label={type==="server"?"服务配置":"参数来源组件"} name="paramComponent">
            <Input disabled={true} />
          </Form.Item>
        )}
        <Form.Item label={type==="server"?"目标配置值":"参数名称"} name="paramName">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label={type==="server"?"配置中心":"参数值" }name="paramValue" rules={[{ required: true, message: '请填写参数值' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={type==="server"?"配置说明":"填写说明"} name="paramDescription">
          <Input.TextArea placeholder="填写说明" rows={3} disabled={true} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
