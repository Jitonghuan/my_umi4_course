// 日志告警新增/编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/25 09:26

import React, { useEffect, useState } from 'react';
import { Form, Drawer, Input, Select, Button, message, Radio, InputNumber, TimePicker, Alert } from 'antd';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { FormOutlined } from '@ant-design/icons';
import moment from 'moment';
import * as APIS from './service';
import {
  useAppOptions,
  useEnvOptions,
  useUserOptions,
  useRuleGroupOptions,
  useRuleIndexOptions,
  useLevelOptions,
  useOperatorOptions,
} from './hooks';
import { ruleCheckName } from './service';
import PromqlEditPreview from '@/pages/monitor/promql-edit-preview';
import UserSelector from '@/components/user-selector';

const { Item: FormItem } = Form;

export interface AlarmEditorProps {
  mode: EditorMode;
  initData?: Record<string, any>;
  onClose: () => any;
  onSave: () => any;
  bizMonitorId?: string;
  bizMonitorType?: string;
}

export default function AlarmEditor(props: AlarmEditorProps) {
  const [field] = Form.useForm();
  const [appOptions] = useAppOptions();
  const [appCode, setAppCode] = useState<string>();
  const [envCode, setEnvCode] = useState<string>();
  const [envOptions] = useEnvOptions(appCode);
  const [userOptions] = useUserOptions();
  const [ruleGroupOptions] = useRuleGroupOptions();
  const [ruleIndexOptions] = useRuleIndexOptions(envCode);
  const [levelOptions] = useLevelOptions();
  const [operationOptions] = useOperatorOptions();
  const [name, setName] = useState(props.initData?.name || '');
  const [visible, setVisible] = useState(false);
  const [initData, setInitData] = useState({});

  useEffect(() => {
    if (props.mode === 'HIDE') return;

    setAppCode(undefined);
    setEnvCode(undefined);
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

    if (initData.appCode) {
      setAppCode(initData.appCode);
    }
    if (initData.envCode) {
      setEnvCode(initData.envCode);
    }
    setName(initData.name || '');
  }, [props.mode]);

  // 应用Code 联动 envCode
  const handleAppCodeChange = (next: string) => {
    setAppCode(next);
    setEnvCode(undefined);
    field.resetFields(['envCode', 'index']);
  };

  // envCode 联动 index
  const handleEnvCodeChange = (next: string) => {
    setEnvCode(next);
    field.resetFields(['index']);
  };

  const handleOk = async () => {
    const values = await field.validateFields();

    const submitData = {
      ...values,
      receiver: (values.receiver || []).join(','),
      interval: `${values.interval}m`,
      silenceStart: values.silenceStart?.format('HH:mm'),
      silenceEnd: values.silenceEnd?.format('HH:mm'),
      name,
      bizMonitorId: props.bizMonitorId,
      bizMonitorType:  props.bizMonitorType
    };

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

  async function checkName() {
    if (name && name !== props.initData?.name) {
      await getRequest(ruleCheckName, {
        data: {
          name,
        },
      });
    }
  }

  async function getParams() {
    const value = await field.getFieldsValue();
    setInitData(value);
  }

  const disableEdit = props.mode === 'EDIT' && props.initData?.status === '1';

  return (
    <Drawer
      width={800}
      title={props.mode === 'EDIT' ? '编辑告警' : '新增告警'}
      visible={props.mode !== 'HIDE'}
      maskClosable={false}
      onClose={props.onClose}
      footer={
        <div className="drawer-custom-footer">
          <Button type="primary" disabled={disableEdit} onClick={handleOk}>
            确认
          </Button>
          <Button type="default" onClick={props.onClose}>
            取消
          </Button>
        </div>
      }
    >
      {disableEdit ? <Alert type="warning" message="告警规则已停用，无法编辑" style={{ marginBottom: 16 }} /> : null}

      <Form form={field} labelCol={{ flex: '132px' }} wrapperCol={{ span: 16 }}>
        <FormItem label="告警名称" name="name" rules={[{ required: true, message: '请输入告警名称' }]}>
          <Input placeholder="请输入" value={name} onChange={(e) => setName(e.target.value)} onBlur={checkName} disabled={props.mode === 'EDIT'} />
        </FormItem>
        <FormItem label="应用名" name="appCode" rules={[{ required: true, message: '请选择应用' }]}>
          <Select
            placeholder="请选择"
            options={appOptions}
            onChange={handleAppCodeChange}
            disabled={props.mode === 'EDIT'}
            showSearch
          />
        </FormItem>
        <FormItem label="应用环境" name="envCode" rules={[{ required: true, message: '请选择应用环境' }]}>
          <Select
            placeholder="请选择"
            options={envOptions}
            onChange={handleEnvCodeChange}
            disabled={props.mode === 'EDIT'}
            showSearch
          />
        </FormItem>
        <FormItem label="分类" name="group" rules={[{ required: true, message: '请选择告警分类' }]}>
          <Select placeholder="请选择" options={ruleGroupOptions} />
        </FormItem>
        <FormItem label="索引" name="index" rules={[{ required: true, message: '请选择索引' }]}>
          <Select placeholder="请选择" options={ruleIndexOptions} />
        </FormItem>
        <FormItem label="告警表达式" required={true}>
          <FormItem noStyle name="expression" rules={[{ required: true, message: '请输入告警表达式' }]}>
            <Input.TextArea
              disabled={true}
              placeholder={`例: d1: "abc" AND d2: "xyz"`}
              style={{ marginBottom: 8, width: 470 }}
            />
          </FormItem>
          {!disableEdit && (
            <span style={{ marginBottom: 40, marginLeft: 2, display: 'inline-block', height: '100%' }}>
              <FormOutlined
                style={{ fontSize: 18, color: '#6495ED' }}
                onClick={() => {
                  void getParams();
                  setVisible(true);
                }}
              />
            </span>
          )}

          <Input.Group compact>
            <FormItem
              noStyle
              name="operator"
              initialValue={operationOptions[0]?.value}
              rules={[{ required: true, message: '请输入告警表达式' }]}
            >
              <Select options={operationOptions} style={{ width: 80 }} />
            </FormItem>
            <FormItem noStyle name="numberEvents" rules={[{ required: true, message: '请输入告警阈值' }]}>
              <Input placeholder="阈值" style={{ width: 200 }} />
            </FormItem>
          </Input.Group>
        </FormItem>
        <FormItem label="采集频率" required={true} tooltip="采集频率和告警阈值结合使用。若采集频率为5分钟，代表任意5分钟内达到告警阈值即触发告警。">
          <Input.Group compact>
            <FormItem noStyle name="interval" rules={[{ required: true, message: '请填写采集频率' }]}>
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
        <FormItem label="通知对象" name="receiver">
          <UserSelector />
        </FormItem>
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
        <FormItem label="DingToken" name="dingToken">
          <Input />
        </FormItem>
      </Form>
      {visible && (
        <PromqlEditPreview
          visible={visible}
          initData={initData}
          onClose={() => setVisible(false)}
          onConfirm={(str: string) => {
            setVisible(false);
            field.setFieldsValue({
              expression: str,
            });
          }}
        />
      )}
    </Drawer>
  );
}
