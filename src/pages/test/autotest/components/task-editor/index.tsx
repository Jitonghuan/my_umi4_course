// 任务新增 / 编辑
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/08 16:17

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Drawer, Button, Input, Form, Select, Radio, message } from 'antd';
import FELayout from '@cffe/vc-layout';
import { postRequest, getRequest } from '@/utils/request';
import * as APIS from '../../service';
import { EditorMode, TaskItemVO } from '../../interfaces';
import { useEnvOptions } from '../../hooks';
import './index.less';

const { Item: FormItem } = Form;

export interface TaskEditorProps {
  mode?: EditorMode;
  initData?: TaskItemVO;
  onClose?: () => any;
  onSave?: () => any;
}

export default function TaskEditor(props: TaskEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { mode, initData, onClose, onSave } = props;
  const [envOptons] = useEnvOptions();
  const [editField] = Form.useForm();

  const handleOk = useCallback(() => {}, [mode, initData]);

  useEffect(() => {
    if (mode === 'HIDE') return;
    editField.resetFields();
    if (mode === 'ADD') return;

    editField.setFieldsValue({
      taskName: initData?.name,
      cron: initData?.cron,
      runEnv: initData?.runEnv,
      suiteType: initData?.suiteType,
    });

    // TODO 如果有 initData?.testSuite，需要初始化数据，通过 id 获取 caseList
  }, [mode]);

  const handleSubmit = () => {};

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      title={mode === 'ADD' ? '新增任务' : '编辑任务'}
      maskClosable={false}
      onClose={onClose}
      width={600}
      footer={
        <div className="drawer-custom-footer">
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
          <Button type="default" onClick={() => onClose?.()}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editField} labelCol={{ flex: '100px' }}>
        <FormItem label="任务名称" name="taskName" rules={[{ required: true, message: '请输入任务名' }]}>
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem label="执行机制" name="cron">
          <Input.TextArea placeholder="cron表达式，不填表示手动执行" />
        </FormItem>
        <FormItem label="执行环境" name="runEnv" rules={[{ required: true, message: '请选择执行环境' }]}>
          <Select placeholder="请选择" options={envOptons} />
        </FormItem>
        <FormItem label="测试集合" name="suiteType" initialValue={0}>
          <Radio.Group
            options={[
              { label: '接口', value: 0 },
              { label: '场景', value: 1 },
            ]}
          />
        </FormItem>
      </Form>
    </Drawer>
  );
}
