// 新增/修改 接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/01 15:32

import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  Drawer,
  Form,
  Input,
  message,
  Select,
  Radio,
  Tabs,
  Table,
  Button,
  Switch,
} from 'antd';
import FELayout from '@cffe/vc-layout';
import * as APIS from '../service';
import { getRequest, postRequest } from '@/utils/request';
import TableKVField from '@/components/table-kv-field';
import { TreeNode, EditorMode } from '../interfaces';
import {
  API_TYPE_OPTIONS,
  PARAM_TYPE_OPTIONS,
  API_METHOD_OPTIONS,
} from '../common';

const formLayout = {
  labelCol: { flex: '88px' },
};

const { Item: FormItem } = Form;

export interface ApiEditorProps {
  mode: EditorMode;
  targetNode?: TreeNode;
  onClose: () => any;
  onSave: () => any;
}

export default function ApiEditor(props: ApiEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { mode = 'HIDE', onClose, onSave, targetNode } = props;
  const [apiType, setApiType] = useState(API_TYPE_OPTIONS[0].value);
  const [editField] = Form.useForm();

  useEffect(() => {
    if (mode === 'HIDE') return;

    editField.resetFields();
    if (mode === 'ADD') return;

    // TODO 回填接口数据
  }, [mode]);

  const handleSubmit = useCallback(async () => {
    const values = await editField.validateFields();
    console.log('>>> handleSubmit, values', values);
  }, [mode, targetNode]);

  return (
    <Drawer
      title={mode === 'EDIT' ? '编辑接口' : '新增接口'}
      visible={mode !== 'HIDE'}
      onClose={() => onClose()}
      className="test-api-editor"
      width={600}
      footer={
        <div className="api-editor-footer">
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
          <Button type="default" onClick={() => onClose()}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editField} {...formLayout}>
        {/* ----- common ----- */}
        <FormItem label="所属应用">
          <span className="ant-form-text">{targetNode?.title}</span>
        </FormItem>
        <FormItem
          label="接口名称"
          name="apiName"
          rules={[{ required: true, message: '请输入接口名称' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          label="是否生效"
          name="status"
          initialValue={true}
          valuePropName="checked"
        >
          <Switch />
        </FormItem>
        <FormItem
          label="接口类型"
          name="apiType"
          initialValue={API_TYPE_OPTIONS[0].value}
        >
          <Radio.Group
            options={API_TYPE_OPTIONS}
            onChange={(e) => setApiType(e.target.value)}
          />
        </FormItem>
        <FormItem
          label="接口地址"
          name="path"
          rules={[{ required: true, message: '请输入接口地址' }]}
        >
          <Input placeholder="/api/aaa/bbb" />
        </FormItem>
        <FormItem
          label="Method"
          name="method"
          initialValue={API_METHOD_OPTIONS[0].value}
          rules={[{ required: true, message: '请选择接口方法' }]}
        >
          <Select placeholder="请选择" options={API_METHOD_OPTIONS} />
        </FormItem>

        {/* ---- http ----- */}
        {apiType === 0 ? (
          <Tabs defaultActiveKey="parameters">
            <Tabs.TabPane key="parameters" tab="parameters">
              <FormItem
                label="参数类型"
                name="paramType"
                initialValue={PARAM_TYPE_OPTIONS[0].value}
              >
                <Radio.Group
                  options={PARAM_TYPE_OPTIONS}
                  className="flex-radio-group"
                />
              </FormItem>
              <FormItem noStyle name="parameters">
                <TableKVField />
              </FormItem>
            </Tabs.TabPane>
            <Tabs.TabPane key="headers" tab="headers">
              HEADERS~~~~
            </Tabs.TabPane>
          </Tabs>
        ) : null}

        {/* ----- dubbo ----- */}
        {apiType === 1 ? (
          <FormItem
            label="Group"
            name="group"
            rules={[{ required: true, message: '请输入 group' }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
        ) : null}
        {apiType === 1 ? (
          <FormItem
            label="Version"
            name="version"
            rules={[{ required: true, message: '请输入接口版本' }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
        ) : null}
        {apiType === 1 ? (
          <FormItem label="Args" name="args">
            <Input.TextArea placeholder="请输入" rows={8} />
          </FormItem>
        ) : null}
      </Form>
    </Drawer>
  );
}
