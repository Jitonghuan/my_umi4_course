// edit data template
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/16 16:35

import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import { Drawer, Form, Button, Checkbox, Input, Select, message } from 'antd';
import { BugOutlined } from '@ant-design/icons';
import EditorTable from '@cffe/pc-editor-table';
import FELayout from '@cffe/vc-layout';
import usePublicData from '@/utils/usePublicData';
import { postRequest } from '@/utils/request';
import { useOperationTypeOptions, useVarTypeOptions } from './hooks';
import ScriptEditor from '@/components/script-editor';
import ExecResult from '@/components/exec-result';
import * as APIS from '../../service';
import './index.less';

const { Item: FormItem } = Form;
const { TextArea } = Input;

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
  const [varTypeOptions] = useVarTypeOptions();
  const [operationTypeOptions] = useOperationTypeOptions();
  const [pending, setPending] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [resultData, setResultData] = useState<any>();

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
      desc: initData?.desc,
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

  const payloadFormatter = useCallback((values) => {
    const { project, params = [], steps = [] } = values;

    return {
      project,
      env: 'test',
      params: (params || []).map((n: any) => ({ name: n.name, value: n.value, type: n.type, desc: n.desc })),
      steps: (steps || []).map((n: any, index: number) => ({
        ...n,
        step: index + 1,
        times: 1,
        sleep: 0,
      })),
    } as Record<string, any>;
  }, []);

  // 保存数据
  const handleSave = useCallback(async () => {
    const values = await editField.validateFields();
    console.log('>> handleSave', values);

    const { name, desc } = values;
    const payload: Record<string, any> = {
      ...payloadFormatter(values),
      name,
      desc,
      env: values.env?.join(','),
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

  // 调试数据
  const handleDebug = useCallback(async () => {
    const values = await editField.validateFields();
    const payload = payloadFormatter(values);

    setPending(true);
    try {
      const result = await postRequest(APIS.debugTemplate, { data: payload });
      setResultVisible(true);
      setResultData(result.data);
    } finally {
      setPending(false);
    }
  }, []);

  const filteredEnvTypeOptions = useMemo(() => {
    return envListType?.filter((n) => n.value !== 'prod');
  }, [envListType]);

  return (
    <>
      <Drawer
        visible={mode !== 'HIDE'}
        maskClosable={false}
        title={mode === 'ADD' ? '新增模板' : '编辑模板'}
        width={900}
        onClose={onClose}
        className="template-editor-wrapper"
        footer={
          <div className="template-editor-footer">
            <Button type="default" loading={pending} onClick={handleDebug} icon={<BugOutlined />} danger>
              调试
            </Button>
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
          <FormItem label="名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入" style={{ width: 720 }} />
          </FormItem>
          <FormItem label="描述" name="desc" rules={[{ required: true, message: '请输入模板描述' }]}>
            <TextArea rows={4} style={{ width: 720 }} />
          </FormItem>
          <div className="form-item-group">
            <FormItem label="业务线" name="project" rules={[{ required: true, message: '请选择业务线' }]}>
              <Select options={appTypeData} placeholder="请选择 " style={{ width: 300 }} />
            </FormItem>
            <FormItem label="支持环境" name="env" rules={[{ required: true, message: '请选择支持环境' }]}>
              <Checkbox.Group options={filteredEnvTypeOptions} />
            </FormItem>
          </div>
          <h3>定义变量</h3>
          <FormItem
            name="params"
            rules={[
              {
                validator: async (_, value: any[]) => {
                  if (value?.find((n) => !(n.name && n.value && n.type))) {
                    throw new Error('变量名、类型、值不能为空 !');
                  }
                },
                validateTrigger: [],
              },
            ]}
          >
            <EditorTable<any>
              creator={{ clone: true }}
              columns={[
                {
                  title: '序号',
                  dataIndex: '__count',
                  fieldType: 'readonly',
                  colProps: { width: 60, align: 'center' },
                },
                { title: '变量名', dataIndex: 'name' },
                {
                  title: '类型',
                  dataIndex: 'type',
                  required: true,
                  fieldType: 'select',
                  valueOptions: varTypeOptions,
                  colProps: { width: 160 },
                },
                {
                  title: '值',
                  dataIndex: 'value',
                  // fieldType: (record) => {
                  //   return ['Integer', 'Float'].includes(record.type) ? 'number' : 'text';
                  // }
                },
                { title: '描述', dataIndex: 'desc' },
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
            <EditorTable<any>
              creator={{ clone: ['type', 'name', 'script'] }}
              columns={[
                {
                  title: '序号',
                  dataIndex: '__count',
                  fieldType: 'readonly',
                  colProps: { width: 60, align: 'center' },
                },
                {
                  title: '步骤类型',
                  dataIndex: 'type',
                  fieldType: 'select',
                  valueOptions: operationTypeOptions,
                  colProps: { width: 120 },
                },
                { title: '步骤名称', dataIndex: 'name', colProps: { width: 160 } },
                {
                  title: '脚本',
                  dataIndex: 'script',
                  fieldType: 'custom',
                  component: ScriptEditor,
                  fieldProps: (value, index, record) => {
                    return { mode: record.type === 'SQL' ? 'sql' : 'json' };
                  },
                },
              ]}
            />
          </FormItem>
        </Form>
      </Drawer>

      <ExecResult visible={resultVisible} data={resultData} onClose={() => setResultVisible(false)} />
    </>
  );
}
