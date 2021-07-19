// edit data template
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/16 16:35

import React, { useCallback, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Checkbox, Input, Select, message } from 'antd';
import EditorTable from '@cffe/pc-editor-table';
import FELayout from '@cffe/vc-layout';
import usePublicData from '@/utils/usePublicData';
import { postRequest } from '@/utils/request';
import { EditorMode } from '../../interfaces';
import { useOperationTypeOptions } from './hooks';
import ScriptEditor from '@/components/script-editor';
import * as APIS from '../../service';
import './index.less';

const { Item: FormItem } = Form;

export interface TemplateEditorProps {
  mode?: EditorMode;
  initData?: any;
  onClose?: () => any;
  onSave?: () => any;
}

export default function TemplateEditor(props: TemplateEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { mode, initData, onClose, onSave } = props;
  const [editField] = Form.useForm();
  // const [varTypeOptions] = useVarTypeOptions();
  const [operationTypeOptions] = useOperationTypeOptions();

  const { envListType, appTypeData } = usePublicData({
    isUseAppEnv: false,
    isUseAppBranch: false,
    isUseAppLists: false,
    isEnvType: true,
    useCodeValue: true,
  });

  useEffect(() => {
    if (mode === 'HIDE') return;
    editField.resetFields();
    if (mode === 'ADD') return;

    const params = initData?.params;

    const initValues = {
      name: initData?.name,
      env: (initData?.env || '').split(/,\s?/),
      project: initData?.project,
      steps: initData?.steps || [],
      params: params
        ? Array.isArray(params)
          ? params
          : Object.keys(params || {}).map((name) => ({ name, value: params[name] }))
        : [],
    };

    editField.setFieldsValue(initValues);
  }, [mode]);

  const handleSave = useCallback(async () => {
    const values = await editField.validateFields();
    console.log('>> handleSave', values);

    const { name, project, env, params = [], steps = [] } = values;
    const payload: any = {
      name,
      project,
      env: (env || []).join(','),
      params: (params || []).map((n: any) => ({ name: n.name, value: n.value })),
      steps: (steps || []).map((n: any, index: number) => ({
        ...n,
        step: index + 1,
        times: 1,
        sleep: 0,
      })),
    };

    if (mode === 'ADD') {
      payload.createUser = userInfo.userName;
      await postRequest(APIS.createDataFactory, {
        data: payload,
      });
    } else {
      payload.id = initData.id;
      payload.modifyUser = userInfo.userName;
      await postRequest(APIS.updateDataFactory, {
        data: payload,
      });
    }

    message.success('保存成功!');
    onSave?.();
  }, [mode, initData]);

  return (
    <Drawer
      visible={mode !== 'HIDE'}
      maskClosable={false}
      title={mode === 'ADD' ? '新增模板' : '编辑模板'}
      width={900}
      onClose={onClose}
      className="template-editor-wrapper"
      footer={
        <div className="template-editor-footer">
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
          <Button type="default" onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editField} labelCol={{ flex: '100px' }}>
        <FormItem label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
          <Input placeholder="请输入" style={{ width: 720 }} />
        </FormItem>
        <div className="form-item-group">
          <FormItem label="项目" name="project" rules={[{ required: true, message: '请选择模板项目' }]}>
            <Select options={appTypeData} placeholder="请选择 " style={{ width: 300 }} />
          </FormItem>
          <FormItem label="支持环境" name="env" rules={[{ required: true, message: '请选择支持环境' }]}>
            <Checkbox.Group options={envListType} />
          </FormItem>
        </div>
        <h3>定义变量</h3>
        <FormItem
          name="params"
          rules={[
            {
              validator: async (_, value: any[]) => {
                if (value?.find((n) => !(n.name && n.value))) {
                  throw new Error('变量名 和 值不能为空 !');
                }
              },
              validateTrigger: [],
            },
          ]}
        >
          <EditorTable
            columns={[
              { title: '序号', dataIndex: '__count', fieldType: 'readonly', colProps: { width: 60, align: 'center' } },
              { title: '变量名', dataIndex: 'name' },
              {
                title: '类型',
                dataIndex: 'type',
                fieldType: 'readonly',
                colProps: { render: () => '自定义值', width: 100 },
              },
              { title: '值', dataIndex: 'value' },
            ]}
          />
        </FormItem>
        <h3>构建步骤</h3>
        <FormItem
          name="steps"
          rules={[
            {
              validator: async (_, value: any[]) => {
                if (value?.find((n) => !(n.type && n.name && n.script))) {
                  throw new Error('还有未填写的数据项!');
                }
              },
              validateTrigger: [],
            },
          ]}
        >
          <EditorTable
            columns={[
              { title: '序号', dataIndex: '__count', fieldType: 'readonly', colProps: { width: 60, align: 'center' } },
              {
                title: '操作类型',
                dataIndex: 'type',
                fieldType: 'select',
                valueOptions: operationTypeOptions,
                colProps: { width: 120 },
              },
              { title: '名称', dataIndex: 'name', colProps: { width: 160 } },
              { title: '脚本', dataIndex: 'script', fieldType: 'custom', component: ScriptEditor },
            ]}
          />
        </FormItem>
      </Form>
    </Drawer>
  );
}
