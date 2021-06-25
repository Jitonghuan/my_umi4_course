// 日志告警新增/编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/25 09:26

import React, { useState, useEffect, useContext } from 'react';
import { Form, Modal, Input, Select, Button, Radio, InputNumber } from 'antd';
import { getRequest, postRequest } from '@/utils/request';
import * as APIS from './service';
import { EditorMode } from './interface';
import {
  useAppOptions,
  useEnvOptions,
  useCategoryOptions,
  useNotifyTypeOptions,
  useIntervalUnitOptions,
  useLevelOptions,
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
  const [appOptions] = useAppOptions();
  const [envOptions] = useEnvOptions();
  const [categoryOptions] = useCategoryOptions();
  const [notifyTypeOptions] = useNotifyTypeOptions();
  const [intervalUnitOptions] = useIntervalUnitOptions();
  const [levelOptions] = useLevelOptions();

  const handleOk = async () => {
    const values = await field.validateFields();
    console.log('> AlarmEditor.handleOk: ', values);
  };

  return (
    <Modal
      width={800}
      title={props.mode === 'EDIT' ? '编辑告警' : '新增告警'}
      visible={props.mode !== 'HIDE'}
      maskClosable={false}
      onCancel={() => props.onClose?.()}
      onOk={handleOk}
    >
      <Form form={field} labelCol={{ flex: '132px' }} wrapperCol={{ span: 16 }}>
        <FormItem
          label="告警名称"
          name="name"
          rules={[{ required: true, message: '请输入告警名称' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          label="应用名"
          name="appCode"
          rules={[{ required: true, message: '请选择应用' }]}
        >
          <Select placeholder="请选择" options={appOptions} />
        </FormItem>
        <FormItem
          label="应用环境"
          name="envCode"
          rules={[{ required: true, message: '请选择应用环境' }]}
        >
          <Select placeholder="请选择" options={envOptions} />
        </FormItem>
        <FormItem
          label="分类"
          name="category"
          rules={[{ required: true, message: '请选择告警分类' }]}
        >
          <Select placeholder="请选择" options={categoryOptions} />
        </FormItem>
        <FormItem
          label="告警表达式"
          name="expression"
          rules={[{ required: true, message: '请输入告警表达式' }]}
        >
          <Input.TextArea placeholder={`例: d1: "abc" AND d2: "xyz"`} />
        </FormItem>
        <FormItem label="采集频率">
          <FormItem noStyle name="interval">
            <InputNumber />
          </FormItem>
          <FormItem
            noStyle
            name="unit"
            initialValue={intervalUnitOptions[0]?.value}
          >
            <Select
              placeholder="请选择"
              options={intervalUnitOptions}
              style={{ width: 80, marginLeft: 12 }}
            />
          </FormItem>
        </FormItem>
        <FormItem
          label="告警消息"
          name="message"
          rules={[{ required: true, message: '请输入告警消息' }]}
        >
          <Input.TextArea placeholder="请输入告警消息" />
        </FormItem>
        <FormItem
          label="告警级别"
          name="level"
          rules={[{ required: true, message: '请选择告警级别' }]}
          initialValue={levelOptions[0]?.value}
        >
          <Select placeholder="请选择" options={levelOptions} />
        </FormItem>
        <FormItem
          label="通知对象"
          name="target"
          rules={[{ required: true, message: '通知对象不能为空' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          label="通知方式"
          name="notifyType"
          rules={[{ required: true, message: '请选择通知方式' }]}
          initialValue={notifyTypeOptions[0]?.value}
        >
          <Select placeholder="请选择" options={notifyTypeOptions} />
        </FormItem>
        <FormItem label="是否静默" name="silent" initialValue={0}>
          <Radio.Group>
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </FormItem>
      </Form>
    </Modal>
  );
}
