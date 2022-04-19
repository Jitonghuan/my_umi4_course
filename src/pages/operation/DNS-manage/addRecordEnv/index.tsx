// 新增环境抽屉页
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/10/25 18:30

import React from 'react';
import { history } from 'umi';
import { useEffect } from 'react';
import { useAddDnsManage, useUpdateDnsManage } from '../hooks';
import { Input, Form, Select, Spin, Modal } from 'antd';
import { recordEditData } from '../index';
// import { createEnv, appTypeList, updateEnv, queryNGList } from '../service';

export interface RecordEditDataProps {
  mode: EditorMode;
  initData?: recordEditData;
  envCode: any;
  onClose: () => any;
  onSave: () => any;
}

export const options = [
  {
    label: 'A-将域名指向IPV4地址',
    value: 'A',
  },
  {
    label: 'CNAME-将域名指向另外一个域名',
    value: 'CNAME',
  },
  {
    label: 'AAAA-将域名指向一个IPV6地址',
    value: 'AAAA',
  },
  {
    label: 'NS-将子域名指定其他DNS服务器解析',
    value: 'NS',
  },
  {
    label: 'MX-将域名指向邮件服务器地址',
    value: 'MX',
  },
  {
    label: 'SRV-记录提供特定的服务的服务器',
    value: 'SRV',
  },
  {
    label: 'TXT-文本长度限制512，通常做SPF记录（反垃圾邮件）',
    value: 'TXT',
  },
  {
    label: 'CAA-CA证书颁发机构授权校验',
    value: 'CAA',
  },
];

export default function addEnvData(props: RecordEditDataProps) {
  const [createRecordForm] = Form.useForm();
  const { mode, onClose, onSave, initData, envCode } = props;
  const [addLoading, addDnsManage] = useAddDnsManage();
  const [updateLoading, updateDnsManage] = useUpdateDnsManage();

  useEffect(() => {
    if (mode === 'HIDE') return;

    if (initData && mode === 'EDIT') {
      createRecordForm.setFieldsValue({
        ...initData,
      });
    }
    if (mode === 'ADD') {
      createRecordForm.resetFields();
    }
  }, [mode]);

  const handleSubmit = () => {
    let param = createRecordForm.getFieldsValue();
    console.log('param', param);
    if (mode === 'ADD') {
      let paramObj = { envCode: envCode.envCode, status: '0', ...param };
      addDnsManage(paramObj).then(() => {
        onSave();
      });
    } else if (mode === 'EDIT') {
      let paramObj = { envCode: envCode.envCode, id: initData?.id, status: initData?.status, ...param };
      updateDnsManage(paramObj).then(() => {
        onSave();
      });
    }
  };

  return (
    <Modal
      visible={mode !== 'HIDE'}
      title={mode === 'EDIT' ? '修改记录' : '添加记录'}
      onCancel={() => onClose()}
      onOk={handleSubmit}
      width={'30%'}
    >
      <Spin spinning={mode === 'EDIT' ? updateLoading : addLoading}>
        <div className="recordAdd">
          <Form
            form={createRecordForm}
            layout="vertical"
            // onFinish={handleSubmit}
            onReset={() => {
              createRecordForm.resetFields();
            }}
          >
            <Form.Item label="记录类型：" name="recordType" rules={[{ required: true, message: '这是必填项' }]}>
              <Select style={{ width: '24vw' }} options={options} placeholder="A- 将域名指向一个IPV4地址"></Select>
            </Form.Item>
            <Form.Item
              label="主机记录："
              name="hostRecord"
              rules={[
                {
                  required: true,
                  message: '请输入正确的主机记录!',
                  // pattern: /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/g
                },
              ]}
            >
              <Input style={{ width: '24vw' }} placeholder="请输入主机记录"></Input>
            </Form.Item>
            <Form.Item name="recordValue" label="记录值" rules={[{ required: true, message: '这是必填项' }]}>
              <Input placeholder="请输入记录值" style={{ width: '24vw' }}></Input>
            </Form.Item>
            <Form.Item name="remark" label="备注：">
              <Input.TextArea placeholder="请输入备注" style={{ width: '24vw', height: 80 }}></Input.TextArea>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
