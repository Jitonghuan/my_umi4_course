import React from 'react';
import { Modal, Select, Form } from 'antd';
import ConfigurePointRulesForm from '../../global-control-point-rules/configure-point-rules-form';

export default function CreateOrEditRuleModal(props: any) {
  const { visible, setVisible, ruleId } = props;
  const isCreate = ruleId === undefined;

  return (
    <Modal
      visible={visible}
      maskClosable={false}
      onCancel={() => setVisible(false)}
      title={isCreate ? '新增卡点规则' : '编辑卡点规则'}
      width={700}
    >
      <Form>
        <Form.Item label="应用分类">
          <Select />
        </Form.Item>
        <Form.Item label="应用code">
          <Select />
        </Form.Item>
      </Form>
      <ConfigurePointRulesForm isEdit />
    </Modal>
  );
}
