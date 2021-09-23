import React, { useEffect } from 'react';
import { Modal, Select, Form } from 'antd';
import ConfigurePointRulesForm from '../../_components/configure-point-rules-form';
import * as HOOKS from '../../hooks';

export default function CreateOrEditRuleModal(props: any) {
  const { visible, setVisible, ruleId } = props;
  const isCreate = ruleId === undefined;
  const [appCateEnum] = HOOKS.useAppCateEnum();
  const [appCodeEnum] = HOOKS.useAppCodeEnum();

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
          <Select options={appCateEnum} />
        </Form.Item>
        <Form.Item label="应用code">
          <Select options={appCodeEnum} />
        </Form.Item>
      </Form>
      <ConfigurePointRulesForm isEdit />
    </Modal>
  );
}
