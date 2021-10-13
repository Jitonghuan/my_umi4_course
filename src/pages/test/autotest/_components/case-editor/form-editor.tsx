// 用例编辑 - 表单模式
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/16 14:56

import { useState, useEffect, useContext } from 'react';
import { Form, Steps, Button, Input, message, Radio, Tabs, Switch, Row, Col } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import FELayout from '@cffe/vc-layout';
import { postRequest } from '@/utils/request';
import * as APIS from '../../service';
import { CaseItemVO, TreeNode, FuncProps } from '../../interfaces';
import FuncTableField from './func-table-field';
import CaseTableField from './case-table-field';
import EditorTable from '@cffe/pc-editor-table';
import YmlDebug from '../yml-debug';
import { getFuncListByIds, getCaseListByIds } from './common';
import AceEditor, { JSONValidator } from '@/components/ace-editor';
import { ASSERT_COMPARE_ENUM, VALUE_TYPE_ENUM, PARAM_TYPE } from '../../common';
import { CaseEditorProps, ParamType } from './types';
import { getRequest } from '@/utils/request';

const { Item: FormItem } = Form;

export interface CaseFormEditorProps extends CaseEditorProps {
  field: FormInstance<Record<string, any>>;
  paramType: ParamType;
  onParamTypeChange?: (next: ParamType) => any;
}

/** 获取编辑时的表单初始化数据 */
export async function getInitEditFieldData(initData: CaseItemVO) {
  const hooks = initData.hooks ? JSON.parse(initData.hooks) : {};
  const beforeFuns: FuncProps[] = hooks.setup || [];
  const afterFuncs: FuncProps[] = hooks.teardown || [];
  const beforeCaseIds: number[] = initData.preStep ? initData.preStep.split(',').map((n: string) => +n) : [];

  const res = await getRequest(APIS.getApiInfo, {
    data: { id: initData.apiId },
  });
  const nextParamType: ParamType = res.data.paramType === PARAM_TYPE.JSON ? 'json' : 'form';

  return {
    nextParamType,

    name: initData.name,
    desc: initData.desc,
    allowSkip: initData.allowSkip || false,
    skipReason: initData.skipReason,
    beforeFuncs: await getFuncListByIds(beforeFuns),
    afterFuncs: await getFuncListByIds(afterFuncs),
    beforeCases: await getCaseListByIds(beforeCaseIds),
    customVars: initData.customVars || [],
    headers: initData.headers || [],
    parameters: nextParamType === 'form' ? (typeof initData.parameters !== 'string' ? initData.parameters : []) : [],
    parametersJSON:
      nextParamType === 'json' ? (typeof initData.parameters === 'string' ? initData.parameters : '{}') : '',
    savedVars: initData.savedVars || [],
    resAssert: initData.resAssert || [],
  };
}

/** 获取新增时的表单初始化数据 */
export async function getInitAddFieldData(apiDetail?: Record<string, any>) {
  if (!apiDetail) return {};

  const nextParamType: ParamType = apiDetail.paramType === PARAM_TYPE.JSON ? 'json' : 'form';

  return {
    nextParamType,

    headers: apiDetail.headers || [],
    parameters: apiDetail.paramType === PARAM_TYPE.JSON ? [] : apiDetail.parameters || [],
    parametersJSON: apiDetail.paramType === PARAM_TYPE.JSON ? apiDetail.parameters || '{}' : '',
  };
}

export default function CaseFormEditor(props: CaseFormEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [step, setSetp] = useState<number>(0);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [debugModalVisible, setDebugModalVisible] = useState<boolean>(false);

  // 名字不要太在意，直接复制过来的，又不知道取啥名字好
  const [ymlData, setYmlData] = useState<any>();

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const values = await props.field.validateFields().catch((error) => {
      const info = error.errorFields
        ?.map((n: any) => n.errors)
        .flat()
        .join('; ');
      message.error(info);
      throw error;
    });

    console.log('>>> handleSubmit', values);

    const payload = {
      name: values.name,
      desc: values.desc,
      allowSkip: values.allowSkip || false,
      skipReason: values.skipReason || '',
      headers: values.headers || [],
      parameters: props.paramType === 'form' ? values.parameters || [] : values.parametersJSON || '',
      preStep: (values.beforeCases || []).map((n: any) => n.id).join(','),
      customVars: values.customVars || [],
      savedVars: values.savedVars || [],
      hooks: {
        setup: (values.beforeFuncs || []).map((n: any) => ({
          id: n.id,
          type: n.type || 0,
          argument: n.argument || '',
        })),
        teardown: (values.afterFuncs || []).map((n: any) => ({
          id: n.id,
          type: n.type || 0,
          argument: n.argument || '',
        })),
      },
      resAssert: values.resAssert || [],
      modifyUser: userInfo.userName,
    };

    if (typeof props.hookBeforeSave === 'function') {
      const flag = await props.hookBeforeSave(props.mode, payload);
      setSubmitLoading(false);
      if (!flag) return;
    }

    if (props.mode == 'ADD') {
      await postRequest(APIS.saveCaseInfo, {
        data: {
          ...payload,
          apiId: props.current?.bizId!,
          createUser: userInfo.userName,
        },
      });
    } else {
      await postRequest(APIS.updateCaseInfo, {
        data: {
          ...payload,
          id: props.initData?.id,
          apiId: props.initData?.apiId,
          createUser: props.initData?.createUser,
        },
      });
    }

    message.success('用例保存成功！');
    setSetp(0);
    props.onSave?.();

    setSubmitLoading(false);
  };

  useEffect(() => {
    setSetp(0);
  }, [props.mode]);

  const gotoNextStep = async () => {
    setSetp(step + 1);
  };

  const handleDebug = async () => {
    // apiId: 1473
    // desc: "设置"
    // envId: 13
    // name: "设置"
    // pre_cases: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,…]
    // request: {headers: {authorization: "${get_token($token)}"}, data: [], method: "POST",…}
    // validate: [{eq: ["status_code", 200]}]

    const values = await props.field.validateFields().catch((error) => {
      const info = error.errorFields
        ?.map((n: any) => n.errors)
        .flat()
        .join('; ');
      message.error(info);
      throw error;
    });

    const payload = {
      name: values.name,
      desc: values.desc,
      allowSkip: values.allowSkip || false,
      skipReason: values.skipReason || '',
      headers: values.headers || [],
      parameters: values.parameters || values.parametersJSON || [],
      preStep: (values.beforeCases || []).map((n: any) => n.id).join(','),
      customVars: values.customVars || [],
      savedVars: values.savedVars || [],
      hooks: {
        setup: (values.beforeFuncs || []).map((n: any) => ({
          id: n.id,
          type: n.type || 0,
          argument: n.argument || '',
        })),
        teardown: (values.afterFuncs || []).map((n: any) => ({
          id: n.id,
          type: n.type || 0,
          argument: n.argument || '',
        })),
      },
      resAssert: values.resAssert || [],
      modifyUser: userInfo.userName,
      id: props.initData?.id,
      apiId: props.initData?.apiId || props.apiDetail?.id,
      createUser: props.initData?.createUser,
    };
    if (Object.keys(payload).length === 0) return;
    const { data: ymlData } = await postRequest(APIS.caseToYml, { data: payload });

    if (props.mode == 'ADD') {
      setYmlData({ ...ymlData, apiId: props.current?.bizId! });
    } else {
      setYmlData({ ...ymlData, apiId: props.initData?.apiId });
    }

    setDebugModalVisible(true);
  };

  return (
    <>
      <div className="drawer-body-inner">
        <Form form={props.field}>
          <FormItem
            label="用例名称"
            name="name"
            labelCol={{ flex: '76px' }}
            rules={[{ required: true, message: '请输入用例名称' }]}
          >
            <Input placeholder="请输入用例名称" />
          </FormItem>
          <FormItem
            label="用例描述"
            name="desc"
            labelCol={{ flex: '76px' }}
            rules={[{ required: true, message: '请输入用例描述' }]}
          >
            <Input placeholder="请输入用例描述" />
          </FormItem>
          <FormItem label="允许跳过" labelCol={{ flex: '76px' }}>
            <Row gutter={20}>
              <Col>
                <FormItem name="allowSkip" valuePropName="checked">
                  <Switch />
                </FormItem>
              </Col>
              <Col flex={1}>
                <FormItem noStyle shouldUpdate={(prev, curr) => prev.allowSkip !== curr.allowSkip}>
                  {({ getFieldValue }) =>
                    getFieldValue('allowSkip') ? (
                      <FormItem name="skipReason" rules={[{ required: true, message: '请输入跳过原因' }]}>
                        <Input placeholder="请输入跳过原因" />
                      </FormItem>
                    ) : null
                  }
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <Steps current={step} onChange={(n) => setSetp(n)}>
            <Steps.Step title="前置/后置" />
            <Steps.Step title="定义变量" />
            <Steps.Step title="请求内容" />
            <Steps.Step title="保存返回值" />
            <Steps.Step title="结果断言" />
          </Steps>

          {/* step 0 前置/后置 */}
          <div className="case-editor-step case-editor-step-0" data-visible={step === 0}>
            <FormItem noStyle name="beforeFuncs">
              <FuncTableField title="前置脚本" />
            </FormItem>
            <FormItem noStyle name="beforeCases">
              <CaseTableField title="前置用例" />
            </FormItem>
            <FormItem noStyle name="afterFuncs">
              <FuncTableField title="后置脚本" />
            </FormItem>
          </div>

          {/* step 1 定义变量 */}
          <div className="case-editor-step case-editor-step-1" data-visible={step === 1}>
            <FormItem
              name="customVars"
              initialValue={[]}
              rules={[
                {
                  validator: async (_, value: any[]) => {
                    if (value.find((n) => !(n.key && n.type))) {
                      throw new Error('自定义变量的 key 和 type 必填');
                    }
                  },
                  validateTrigger: [],
                },
              ]}
            >
              <EditorTable
                columns={[
                  { title: '变量名', dataIndex: 'key', required: true },
                  {
                    title: '类型',
                    dataIndex: 'type',
                    required: true,
                    fieldType: 'select',
                    valueOptions: VALUE_TYPE_ENUM,
                    colProps: { width: 160 },
                  },
                  { title: '值', dataIndex: 'value' },
                  { title: '描述', dataIndex: 'desc' },
                ]}
                creator={{ record: { value: '', desc: '' } }}
              />
            </FormItem>
          </div>

          {/* step 2 请求内容 */}
          <div className="case-editor-step case-editor-step-2" data-visible={step === 2}>
            <Tabs defaultActiveKey="parameters">
              <Tabs.TabPane key="parameters" tab="parameters" forceRender>
                <FormItem label="参数格式">
                  <Radio.Group
                    options={['form', 'json']}
                    value={props.paramType}
                    onChange={(e) => props.onParamTypeChange?.(e.target.value)}
                    // disabled={props.mode === 'EDIT'}
                    disabled={true}
                  />
                </FormItem>
                {props.paramType == 'form' ? (
                  <FormItem
                    name="parameters"
                    initialValue={[]}
                    rules={[
                      {
                        validator: async (_, value: any[]) => {
                          if (value.find((n) => !n.key)) {
                            throw new Error('请求参数的 key 必填');
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
                        { title: '描述', dataIndex: 'desc' },
                      ]}
                      creator={{ record: { value: '', desc: '' } }}
                    />
                  </FormItem>
                ) : (
                  <FormItem
                    name="parametersJSON"
                    rules={[
                      {
                        validator: JSONValidator,
                        validateTrigger: [],
                      },
                    ]}
                  >
                    <AceEditor mode="json" height={220} />
                  </FormItem>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane key="headers" tab="headers" forceRender>
                <FormItem
                  name="headers"
                  initialValue={[]}
                  rules={[
                    {
                      validator: async (_, value: any[]) => {
                        if (value.find((n) => !n.key)) {
                          throw new Error('请求头的 key 必填');
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
                      { title: '描述', dataIndex: 'desc' },
                    ]}
                    creator={{ record: { value: '', desc: '' } }}
                  />
                </FormItem>
              </Tabs.TabPane>
            </Tabs>
          </div>

          {/* step 3 保存返回值 */}
          <div className="case-editor-step case-editor-step-3" data-visible={step === 3}>
            <FormItem
              name="savedVars"
              initialValue={[]}
              rules={[
                {
                  validator: async (_, value: any[]) => {
                    if (value.find((n) => !(n.name && n.jsonpath))) {
                      throw new Error('保存返回值的 变量名、表达式 必填');
                    }
                  },
                  validateTrigger: [],
                },
              ]}
            >
              <EditorTable
                columns={[
                  { title: '变量名', dataIndex: 'name', required: true },
                  { title: '表达式', dataIndex: 'jsonpath', required: true },
                  { title: '描述', dataIndex: 'desc' },
                ]}
                creator={{ record: { desc: '' } }}
              />
            </FormItem>
          </div>

          {/* step 4 结果断言 */}
          <div className="case-editor-step case-editor-step-4" data-visible={step === 4}>
            <FormItem
              name="resAssert"
              initialValue={[]}
              rules={[
                {
                  validator: async (_, value: any[]) => {
                    if (value.find((n) => !(n.assertName && n.compare && n.type && n.value))) {
                      throw new Error('断言项的每一行必填');
                    }
                  },
                  validateTrigger: [],
                },
              ]}
            >
              <EditorTable
                columns={[
                  { title: '断言项', dataIndex: 'assertName', required: true },
                  {
                    title: '比较符',
                    dataIndex: 'compare',
                    required: true,
                    fieldType: 'select',
                    valueOptions: ASSERT_COMPARE_ENUM,
                    colProps: { width: 120 },
                  },
                  {
                    title: '类型',
                    dataIndex: 'type',
                    required: true,
                    fieldType: 'select',
                    valueOptions: VALUE_TYPE_ENUM,
                  },
                  { title: '期望值', dataIndex: 'value', required: true },
                ]}
                creator={{}}
              />
            </FormItem>
          </div>
        </Form>
      </div>

      <div className="drawer-custom-footer">
        <Button onClick={handleDebug}>调试</Button>
        {step > 0 ? (
          <Button type="primary" onClick={() => setSetp(step - 1)}>
            上一步
          </Button>
        ) : null}
        {step < 4 ? (
          <Button type="primary" onClick={gotoNextStep}>
            下一步
          </Button>
        ) : null}
        <Button loading={submitLoading} type="primary" onClick={handleSubmit}>
          提交
        </Button>
        <Button type="default" onClick={props.onCancel}>
          取消
        </Button>
      </div>
      <YmlDebug visible={debugModalVisible} ymlData={ymlData} onClose={() => setDebugModalVisible(false)} />
    </>
  );
}
