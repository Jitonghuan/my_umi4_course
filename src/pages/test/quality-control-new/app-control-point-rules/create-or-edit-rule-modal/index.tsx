import React from 'react';
import { Modal, Select, Form } from 'antd';
import ConfigurePointRulesForm from '../../global-control-point-rules/configure-point-rules-form';

export default function CreateOrEditRuleModal(props: any) {
  const { visible, setVisible } = props;

  return (
    <Modal visible={visible} onCancel={() => setVisible(false)}>
      <Form>
        <Form.Item label="应用分类">
          <Select />
        </Form.Item>
        <Form.Item label="应用code">
          <Select />
        </Form.Item>
      </Form>
      <ConfigurePointRulesForm />
    </Modal>
  );
}
