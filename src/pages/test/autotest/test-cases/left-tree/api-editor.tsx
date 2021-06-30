// 新增/修改 接口
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/01 15:32

import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { Drawer, Form, Input, message, Select, Radio, Tabs, Button, Switch } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';
import FELayout from '@cffe/vc-layout';
import * as APIS from '../../service';
import { getRequest, postRequest } from '@/utils/request';
import DebounceSelect from '@/components/debounce-select';
import EditorTable from '@cffe/pc-editor-table';
import { TreeNode, EditorMode } from '../../interfaces';
import {
  API_TYPE,
  PARAM_TYPE,
  API_METHOD,
  API_TYPE_OPTIONS,
  PARAM_TYPE_OPTIONS,
  API_METHOD_OPTIONS,
} from '../../common';

const formLayout = {
  labelCol: { flex: '88px' },
};

const { Item: FormItem } = Form;

// ---------------------------------------------------------------------

export interface ApiEditorProps {
  mode: EditorMode;
  targetNode?: TreeNode; // 如果是新增，则表示父节点(module)，如果是编辑，则表示当前编辑节点(api)
  onClose: () => any;
  onSave: () => any;
}

export default function ApiEditor(props: ApiEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const { mode = 'HIDE', onClose, onSave, targetNode } = props;
  const [apiType, setApiType] = useState(API_TYPE._default);
  const [paramType, setParamType] = useState(PARAM_TYPE._default);
  const [editField] = Form.useForm();
  const originDataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (mode === 'HIDE') return;

    if (mode === 'ADD') {
      editField.resetFields();
      setApiType(API_TYPE._default);
      setParamType(PARAM_TYPE._default);
      return;
    }

    // 1. 获取 api detail
    getRequest(APIS.getApiInfo, {
      data: { id: targetNode?.bizId },
    }).then((result) => {
      originDataRef.current = result.data;
      const initFields = { ...result.data };

      initFields.headers = initFields.headers || [];

      delete initFields.gmtCreate;
      delete initFields.gmtModify;
      delete initFields.modifyUser;

      setApiType(initFields.apiType ?? API_TYPE._default);
      setParamType(initFields.paramType ?? PARAM_TYPE._default);

      if (initFields.paramType === PARAM_TYPE.JSON) {
        initFields.parametersJSON = initFields.parameters;
        initFields.parameters = [];
      } else {
        initFields.parametersJSON = '';
      }

      editField.setFieldsValue(initFields);
    });
  }, [mode]);

  const handleSubmit = async () => {
    const values = await editField.validateFields().catch((error) => {
      const info = error.errorFields
        ?.map((n: any) => n.errors)
        .flat()
        .join('; ');
      message.error(info);
      throw error;
    });
    const payload = {
      ...values,
      parameters: paramType === PARAM_TYPE.JSON ? values.parametersJSON || '' : values.parameters || [],
    };
    delete payload.parametersJSON;
    // NOTE 接口类型为 dubbo 的时候仍然会校验此参数，所以要将数据重置 (这个应该让服务端同学修复掉)
    payload.paramType = payload.paramType ?? PARAM_TYPE._default;

    if (mode === 'ADD') {
      await postRequest(APIS.addApi, {
        data: {
          ...payload,
          moduleId: targetNode?.bizId,
          createUser: userInfo.userName,
        },
      });

      message.success('接口新增成功！');
      onSave();
    } else {
      await postRequest(APIS.updateApi, {
        data: {
          ...payload,
          id: originDataRef.current.id,
          moduleId: originDataRef.current.moduleId,
          modifyUser: userInfo.userName,
        },
      });

      message.success('接口修改成功！');
      onSave();
    }
    // ....
  };

  const fetchAppList = useCallback(async (keyword: string) => {
    const result = await getRequest(APIS.getAppList, {
      data: { pageSize: 50, appName: keyword },
    });
    const dataSource = (result.data.dataSource || []).map((n: any) => ({
      label: n.appName,
      value: n.id,
    }));
    return dataSource;
  }, []);

  // 修改 apiType
  const handleApiTypeChange = (e: RadioChangeEvent) => {
    const next = e.target.value;
    setApiType(next);

    // 重置 method 值
    editField.setFieldsValue({
      method: next === API_TYPE.DUBBO ? '' : API_METHOD._default,
    });
  };

  return (
    <Drawer
      title={mode === 'EDIT' ? '编辑接口' : '新增接口'}
      visible={mode !== 'HIDE'}
      onClose={() => onClose()}
      maskClosable={false}
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
        <FormItem label="所属应用" name="appId" rules={[{ required: true, message: '请选择应用' }]}>
          <DebounceSelect labelInValue={false} fetchOptions={fetchAppList} placeholder="输入应用名搜索" fetchOnMount />
        </FormItem>
        <FormItem label="接口名称" name="name" rules={[{ required: true, message: '请输入接口名称' }]}>
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem label="是否生效" name="status" initialValue={true} valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItem label="接口类型" name="apiType" initialValue={API_TYPE._default}>
          <Radio.Group options={API_TYPE_OPTIONS} onChange={handleApiTypeChange} />
        </FormItem>
        <FormItem label="接口地址" name="path" rules={[{ required: true, message: '请输入接口地址' }]}>
          <Input placeholder="/api/aaa/bbb" />
        </FormItem>
        {apiType === API_TYPE.HTTP ? (
          <FormItem
            label="Method"
            name="method"
            initialValue={API_METHOD._default}
            rules={[{ required: true, message: '请选择接口方法' }]}
          >
            <Select placeholder="请选择" options={API_METHOD_OPTIONS} />
          </FormItem>
        ) : (
          <FormItem label="Method" name="method" rules={[{ required: true, message: '请输入 Method' }]}>
            <Input placeholder="请输入" />
          </FormItem>
        )}

        {/* ---- http ----- */}
        {apiType === API_TYPE.HTTP ? (
          <Tabs defaultActiveKey="parameters">
            <Tabs.TabPane key="parameters" tab="parameters" forceRender>
              <FormItem label="参数类型" name="paramType" initialValue={1}>
                <Radio.Group
                  options={PARAM_TYPE_OPTIONS}
                  className="flex-radio-group"
                  onChange={(e) => setParamType(e.target.value)}
                />
              </FormItem>
              {paramType !== PARAM_TYPE.JSON ? (
                <FormItem
                  noStyle
                  name="parameters"
                  initialValue={[]}
                  rules={[
                    {
                      validator: async (_, value: any[]) => {
                        if (value.find((n) => !n.key)) {
                          throw new Error('参数的 key 必填');
                        }
                      },
                      validateTrigger: [],
                    },
                  ]}
                >
                  <EditorTable
                    columns={[
                      { title: 'key', dataIndex: 'key', required: true },
                      { title: 'value', dataIndex: 'value' },
                      { title: '说明', dataIndex: 'desc' },
                    ]}
                  />
                </FormItem>
              ) : (
                <FormItem label="参数值" name="parametersJSON">
                  <Input.TextArea placeholder="请输入JSON" rows={6} />
                </FormItem>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane key="headers" tab="headers" forceRender>
              <FormItem
                noStyle
                name="headers"
                initialValue={[]}
                rules={[
                  {
                    validator: async (_, value: any[]) => {
                      if (value.find((n) => !n.key)) {
                        throw new Error('headers 的 key 必填');
                      }
                    },
                    validateTrigger: [],
                  },
                ]}
              >
                <EditorTable
                  columns={[
                    { title: 'key', dataIndex: 'key', required: true },
                    { title: 'value', dataIndex: 'value' },
                    { title: '说明', dataIndex: 'desc' },
                  ]}
                />
              </FormItem>
            </Tabs.TabPane>
          </Tabs>
        ) : null}

        {/* ----- dubbo ----- */}
        {apiType === API_TYPE.DUBBO ? (
          <FormItem label="Group" name="group" rules={[{ required: true, message: '请输入 group' }]}>
            <Input placeholder="请输入" />
          </FormItem>
        ) : null}
        {apiType === API_TYPE.DUBBO ? (
          <FormItem label="Version" name="version" rules={[{ required: true, message: '请输入接口版本' }]}>
            <Input placeholder="请输入" />
          </FormItem>
        ) : null}
        {apiType === API_TYPE.DUBBO ? (
          <FormItem label="Args" name="args">
            <Input.TextArea placeholder="请输入" rows={8} />
          </FormItem>
        ) : null}
      </Form>
    </Drawer>
  );
}
