/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-10-10 12:03:26
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-10-10 15:00:53
 * @FilePath: /fe-matrix/src/pages/station/product-management/product-config/components/station-config/serverModal.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


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
      title="编辑服务配置可变参数值"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={saveLoading}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ flex: '120px' }}>
        {type !== 'config' && (
          <Form.Item label="基准配置值" name="paramName">
            <Input disabled={true} />
          </Form.Item>
        )}
        <Form.Item label="目标配置值" name="paramValue" rules={[{ required: true, message: '请填写参数值' }]}>
          <Input  />
        </Form.Item>
        <Form.Item label="配置中心" name="paramType" >
          <Input  disabled={true} />
        </Form.Item>
        <Form.Item label="配置说明" name="paramDescription">
          <Input.TextArea placeholder="填写说明" rows={3} disabled={true} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
