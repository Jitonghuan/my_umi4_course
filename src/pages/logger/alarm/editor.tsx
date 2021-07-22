// 日志告警新增/编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/25 09:26

import React, { useEffect } from 'react';
import { Form, Modal, Input, Select, message, Radio, InputNumber, TimePicker, Alert } from 'antd';
import { postRequest, putRequest } from '@/utils/request';
import moment from 'moment';
import * as APIS from './service';
import { EditorMode } from './interface';
import {
  useAppOptions,
  useEnvOptions,
  useUserOptions,
  useRuleOptions,
  useNotifyTypeOptions,
  useLevelOptions,
  useOperatorOptions,
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
  const [userOptions] = useUserOptions();
  const [groupSource, indexSource] = useRuleOptions();
  // const [notifyTypeOptions] = useNotifyTypeOptions();
  const [levelOptions] = useLevelOptions();
  const [operationOptions] = useOperatorOptions();

  useEffect(() => {
    if (props.mode === 'HIDE') return;

    field.resetFields();

    if (props.mode === 'ADD') return;

    // 回填数据
    const initData = props.initData!;
    field.setFieldsValue({
      ...initData,
      interval: Number.parseFloat(initData.interval) || undefined,
      receiver: initData.receiver?.split(',') || [],
      silenceStart:
        initData.silence === '1' && initData.silenceStart ? moment(`2021-07-07 ${initData.silenceStart}`) : undefined,
      silenceEnd:
        initData.silence === '1' && initData.silenceEnd ? moment(`2021-07-07 ${initData.silenceEnd}`) : undefined,
    });
  }, [props.mode]);

  const handleOk = async () => {
    const values = await field.validateFields();

    const submitData = {
      ...values,
      receiver: (values.receiver || []).join(','),
      interval: `${values.interval}m`,
      silenceStart: values.silenceStart?.format('HH:mm'),
      silenceEnd: values.silenceEnd?.format('HH:mm'),
    };

    console.log('> AlarmEditor.handleOk: ', submitData);
    if (props.mode === 'ADD') {
      await postRequest(APIS.createRule, {
        data: submitData,
      });

      message.success('创建成功！');
    } else {
      (submitData.id = props.initData?.id),
        await putRequest(APIS.updateRule, {
          data: submitData,
        });

      message.success('保存成功！');
    }

    props.onSave?.();
  };

  const disableEdit = props.mode === 'EDIT' && props.initData?.status === '1';

  return (
    <Modal
      width={800}
      title={props.mode === 'EDIT' ? '编辑告警' : '新增告警'}
      visible={props.mode !== 'HIDE'}
      maskClosable={false}
      onCancel={() => props.onClose?.()}
      onOk={handleOk}
      okButtonProps={{ disabled: disableEdit }}
    >
      {disableEdit ? <Alert type="warning" message="告警规则已停用，无法编辑" style={{ marginBottom: 16 }} /> : null}

      <Form form={field} labelCol={{ flex: '132px' }} wrapperCol={{ span: 16 }}>
        <FormItem label="告警名称" name="name" rules={[{ required: true, message: '请输入告警名称' }]}>
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem label="应用名" name="appCode" rules={[{ required: true, message: '请选择应用' }]}>
          <Select placeholder="请选择" options={appOptions} />
        </FormItem>
        <FormItem label="应用环境" name="envCode" rules={[{ required: true, message: '请选择应用环境' }]}>
          <Select placeholder="请选择" options={envOptions} />
        </FormItem>
        <FormItem label="分类" name="group" rules={[{ required: true, message: '请选择告警分类' }]}>
          <Select placeholder="请选择" options={groupSource} />
        </FormItem>
        <FormItem label="索引" name="index" rules={[{ required: true, message: '请选择索引' }]}>
          <Select placeholder="请选择" options={indexSource} />
        </FormItem>
        <FormItem label="告警表达式">
          <FormItem noStyle name="expression" rules={[{ required: true, message: '请输入告警表达式' }]}>
            <Input.TextArea placeholder={`例: d1: "abc" AND d2: "xyz"`} style={{ marginBottom: 8 }} />
          </FormItem>
          <Input.Group compact>
            <FormItem noStyle name="operator" initialValue={operationOptions[0]?.value}>
              <Select options={operationOptions} style={{ width: 80 }} />
            </FormItem>
            <FormItem noStyle name="numberEvents" rules={[{ required: true, message: '请输入告警阈值' }]}>
              <Input placeholder="阈值" style={{ width: 200 }} />
            </FormItem>
          </Input.Group>
        </FormItem>
        <FormItem label="采集频率">
          <Input.Group compact>
            <FormItem noStyle name="interval">
              <InputNumber step={1} min={0.1} />
            </FormItem>
            <Input style={{ width: 60 }} value="分钟" disabled />
          </Input.Group>
        </FormItem>
        <FormItem label="告警消息" name="message" rules={[{ required: true, message: '请输入告警消息' }]}>
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
        <FormItem label="通知对象" name="receiver" rules={[{ required: true, message: '通知对象不能为空' }]}>
          <Select placeholder="请选择" options={userOptions} showSearch mode="multiple" />
        </FormItem>
        {/* <FormItem
          label="通知方式"
          name="receiverType"
          rules={[{ required: true, message: '请选择通知方式' }]}
          initialValue={notifyTypeOptions[0]?.value}
        >
          <Select placeholder="请选择" options={notifyTypeOptions} />
        </FormItem> */}
        <FormItem label="是否静默" name="silence" initialValue={'0'}>
          <Radio.Group>
            <Radio value="0">否</Radio>
            <Radio value="1">是</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem noStyle shouldUpdate={(prev, curr) => prev.silence !== curr.silence}>
          {({ getFieldValue }) =>
            getFieldValue('silence') === '1' ? (
              <FormItem label="静默范围">
                <FormItem noStyle name="silenceStart" rules={[{ required: true, message: '请选择静默开始时间' }]}>
                  <TimePicker format="HH:mm" placeholder="开始时间" style={{ marginRight: 8 }} />
                </FormItem>
                <FormItem noStyle name="silenceEnd" rules={[{ required: true, message: '请选择静默结束时间' }]}>
                  <TimePicker format="HH:mm" placeholder="结束时间" />
                </FormItem>
              </FormItem>
            ) : null
          }
        </FormItem>
      </Form>
    </Modal>
  );
}
