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
  onClose: () => any;
  onSave: () => any;
}

export default function addEnvData(props: RecordEditDataProps) {
  const [createRecordForm] = Form.useForm();
  const { mode, onClose, onSave, initData } = props;
  const [addLoading, addDnsManage] = useAddDnsManage();
  const [updateLoading, updateDnsManage] = useUpdateDnsManage();

  useEffect(() => {
    if (mode === 'HIDE') return;
    if (initData) {
      createRecordForm.setFieldsValue({
        ...initData,
      });
    }
  }, [mode]);

  const handleSubmit = () => {
    let param = createRecordForm.getFieldsValue();
    console.log('param', param);
    if (mode === 'ADD') {
      let paramObj = { envCode: initData?.envCode, status: 0, ...param };
      addDnsManage(paramObj).then(() => {
        onSave();
      });
    } else if (mode === 'EDIT') {
      let paramObj = { envCode: initData?.envCode, id: initData?.id, ...param };
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
              <Select style={{ width: '24vw' }}></Select>
            </Form.Item>
            <Form.Item label="主机记录：" name="hostRecord" rules={[{ required: true, message: '这是必填项' }]}>
              <Input style={{ width: '24vw' }} placeholder="请输入环境名"></Input>
            </Form.Item>
            <Form.Item name="recordValue" label="记录值" rules={[{ required: true, message: '这是必填项' }]}>
              <Input placeholder="请输入记录值" style={{ width: '24vw' }}></Input>
            </Form.Item>
            <Form.Item name="remark" label="备注：">
              <Input.TextArea placeholder="请输入" style={{ width: '24vw', height: 80 }}></Input.TextArea>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
}
