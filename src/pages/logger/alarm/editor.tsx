// 日志告警新增/编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/25 09:26

import React, { useState, useEffect, useContext } from 'react';
import { Form, Modal, Input, Select, Button, Radio } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from './service';
import { EditorMode } from './interface';
import {
  useAppOptions,
  useEnvOptions,
  useCategoryOptions,
  useNotifyTypeOptions,
} from './hooks';

const { Item: FormItem } = Form;

export interface AlarmEditorProps {
  mode: EditorMode;
  initData?: Record<string, any>;
  onClose?: () => any;
  onSave?: () => any;
}

export default function AlarmEditor(props: AlarmEditorProps) {
  const [field] = Form.useForm();

  const handleOk = async () => {
    const values = await field.validateFields();
    console.log('> AlarmEditor.handleOk: ', values);
  };

  return (
    <Modal
      title={props.mode === 'EDIT' ? '编辑告警' : '新增告警'}
      visible={props.mode !== 'HIDE'}
      maskClosable={false}
      onCancel={() => props.onClose?.()}
      onOk={handleOk}
    >
      <Form form={field} labelCol={{ flex: '90px' }}>
        <FormItem label="告警名称" name="name">
          <Input></Input>
        </FormItem>
      </Form>
    </Modal>
  );
}
