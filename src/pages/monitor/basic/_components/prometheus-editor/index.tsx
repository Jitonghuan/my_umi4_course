// 添加监控对象
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/16 20:50

import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input, Select, Button, Drawer, message } from 'antd';
import { renderForm } from '@/components/table-search/form';
import EditorTable from '@cffe/pc-editor-table';
import { FormProps, OptionProps } from '@/components/table-search/typing';
import { EditorMode, KVProps, PromitheusItemProps } from '../../interfaces';
import { postRequest, getRequest } from '@/utils/request';
import * as APIS from '../../services';
import { usePublicData, useIntervalOptions } from './hooks';

const { Item: FormItem } = Form;

export interface PromitheusEditorProps {
  mode?: EditorMode;
  initData?: PromitheusItemProps;
  onClose?: () => any;
  onSave?: () => any;
}

export default function PromitheusEditor(props: PromitheusEditorProps) {
  const { mode, initData, onClose, onSave } = props;
  const [editField] = Form.useForm<PromitheusItemProps>();
  const [intervalOptions] = useIntervalOptions();

  useEffect(() => {
    if (mode === 'HIDE') return;
    editField.resetFields();

    if (mode === 'ADD' || !initData) return;

    const labelList: KVProps[] = Object.keys(initData.labels || {}).map((key) => ({
      key,
      value: initData.labels?.[key],
    }));

    const payload = {
      name: initData.name,
      appCode: initData.appCode,
      envCode: initData.envCode,
      interval: initData.interval,
      metricsUrl: initData.metricsUrl,
      labelList,
    };
    editField.setFieldsValue(payload);
  }, [mode]);

  // 提交表单
  const handleSubmit = useCallback(async () => {
    const { labelList, ...others } = await editField.validateFields();
    const labels = labelList!.reduce((prev, curr) => {
      prev[curr.key] = curr.value;
      return prev;
    }, {} as Record<string, any>);
    const payload: any = {
      ...others,
      labels,
    };

    if (mode === 'ADD') {
      postRequest(APIS.createPrometheus, { data: payload });
    }
    {
      postRequest(APIS.updatePrometheus, { data: payload });
    }
    message.success('保存成功！');
    onSave?.();
  }, [mode, initData, onSave]);

  return (
    <Drawer
      title={mode === 'EDIT' ? '编辑监控' : '添加监控'}
      visible={mode !== 'HIDE'}
      maskClosable={false}
      onClose={onClose}
      width={800}
      footer={
        <div className="drawer-custom-footer">
          <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editField} labelCol={{ flex: '100px' }}>
        <FormItem label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入" disabled={mode === 'EDIT'} />
        </FormItem>
        <FormItem label="应用code" name="appCode" rules={[{ required: true, message: '请选择应用' }]}>
          {mode === 'ADD' ? <Select placeholder="请选择" /> : <Input disabled />}
        </FormItem>
        <FormItem label="环境code" name="envCode" rules={[{ required: true, message: '请选择环境' }]}>
          {mode === 'ADD' ? <Select placeholder="请选择" /> : <Input disabled />}
        </FormItem>
        <FormItem label="采集频率" name="interval" initialValue={intervalOptions[0]?.value}>
          <Select options={intervalOptions} placeholder="请选择" />
        </FormItem>
        <FormItem label="MatchLabels">
          <h4 style={{ color: '#999' }}>MatchLabels已设置默认值，无特殊需求，请不要填写</h4>
          <FormItem noStyle name="labelList">
            <EditorTable
              columns={[
                { dataIndex: 'key', title: '键' },
                { dataIndex: 'value', title: '值' },
              ]}
            />
          </FormItem>
        </FormItem>
      </Form>
    </Drawer>
  );
}
