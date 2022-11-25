import React, { useState } from 'react';
import {Button, Modal, Form, Input, message, Select, Row, Col} from "antd";
import { addSilence } from "../../service";

interface IProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  param?: any;
}

const timeList = ['0.5', '1', '2', '5'];

const AddSilence = (props: IProps) => {
  const { visible, onClose, onConfirm, param = {} } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  async function handleSubmit() {
    const values = await form.validateFields();

    const submitData: any = {
      ...param || {},
      ...values
    };

    setLoading(true);
    const res = await addSilence(submitData);
    setLoading(false);
    if (res?.success) {
      message.success('静默成功');
      form.resetFields();
      void onConfirm();
    }
  }

  function handleClose () {
    form.resetFields();
    onClose();
  }

  return (
    <Modal
      width={660}
      title="静默"
      visible={visible}
      onCancel={handleClose}
      maskClosable={false}
      footer={
        <div className="drawer-footer">
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={handleClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ flex: '100px' }}>
        <Row>
          <Col span={22}>
            <Form.Item  label="静默时间" name="duration"  required rules={[{ required: true, message: '请选择' }]}>
              <Select>
                {
                  timeList.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option>)
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={2}><span style={{marginLeft: '5px'}}>小时</span></Col>
        </Row>
        <Form.Item label="静默原因" name="comment" required rules={[{ required: true, message: '请填写' }]}>
          <Input.TextArea placeholder="请输入" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddSilence;
