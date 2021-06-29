// test case editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 20:15
// NOTE 用例编辑要提取到公共组件中，后期可能提供给其它业务模块使用

import React, { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Steps, Button, Input, message, Radio, Tabs } from 'antd';
import FELayout from '@cffe/vc-layout';
import { postRequest } from '@/utils/request';
import * as APIS from '../../service';
import { CaseItemVO, EditorMode, TreeNode, FuncProps } from '../../interfaces';
import FuncTableField from './func-table-field';
import CaseTableField from './case-table-field';
import TableForm from '@/components/simple-table-form';
import { getFuncListByIds, getCaseListByIds } from './common';
import { ASSERT_COMPARE_ENUM, VALUE_TYPE_ENUM, PARAM_TYPE } from '../../common';
import './index.less';

const { Item: FormItem } = Form;

export interface CaseEditorProps extends Record<string, any> {
  mode: EditorMode;
  current?: TreeNode;
  initData?: CaseItemVO;
  apiDetail?: Record<string, any>;
  onCancel?: () => any;
  onSave?: () => any;
}

export default function CaseEditor(props: CaseEditorProps) {
  const userInfo = useContext(FELayout.SSOUserInfoContext);
  const [editField] = Form.useForm<Record<string, any>>();
  const [step, setSetp] = useState<number>(0);
  const [paramType, setParamType] = useState<'object' | 'array'>('object');

  // 编辑时回填数据
  const initEditField = async (initData: CaseItemVO) => {
    const hooks = initData.hooks ? JSON.parse(initData.hooks) : {};
    const beforeFuns: FuncProps[] = hooks.setup || [];
    const afterFuncs: FuncProps[] = hooks.teardown || [];
    const beforeCaseIds: number[] = initData.preStep ? initData.preStep.split(',').map((n: string) => +n) : [];

    const nextParamType = typeof initData.parameters === 'string' ? 'object' : 'array';
    setParamType(nextParamType);

    editField.setFieldsValue({
      name: initData.name,
      desc: initData.desc,
      beforeFuncs: await getFuncListByIds(beforeFuns),
      afterFuncs: await getFuncListByIds(afterFuncs),
      beforeCases: await getCaseListByIds(beforeCaseIds),
      customVars: initData.customVars || [],
      headers: initData.headers || [],
      parameters: nextParamType === 'array' ? initData.parameters || [] : [],
      parametersJSON: nextParamType === 'object' ? initData.parameters || '' : '',
      savedVars: initData.savedVars || [],
      resAssert: initData.resAssert || [],
    });
  };

  const initAddField = (apiDetail?: Record<string, any>) => {
    if (!apiDetail) return;

    const nextParamType = apiDetail.paramType === PARAM_TYPE.JSON ? 'object' : 'array';
    setParamType(nextParamType);

    editField.setFieldsValue({
      headers: apiDetail.headers || [],
      parameters: apiDetail.paramType === PARAM_TYPE.JSON ? [] : apiDetail.parameters || [],
      parametersJSON: apiDetail.paramType === PARAM_TYPE.JSON ? apiDetail.parameters || '' : '',
    });
  };

  useEffect(() => {
    if (props.mode === 'HIDE') return;

    setSetp(0);
    editField.resetFields();
    setParamType('object');

    if (props.mode === 'EDIT') {
      initEditField(props.initData || ({} as CaseItemVO));
    } else {
      initAddField(props.apiDetail);
    }
  }, [props.mode]);

  const handleSubmit = async () => {
    const values = await editField.validateFields();
    console.log('>>> handleSubmit', values);

    const payload = {
      name: values.name,
      desc: values.desc,
      headers: values.headers || [],
      parameters: paramType === 'array' ? values.parameters || [] : values.parametersJSON || '',
      preStep: (values.beforeCases || []).map((n: any) => n.id).join(','),
      customVars: values.customVars || [],
      savedVars: values.savedVars || [],
      hooks: {
        setup: (values.beforeFuncs || []).map((n: any) => ({
          id: n.id,
          argument: n.argument || '',
        })),
        teardown: (values.afterFuncs || []).map((n: any) => ({
          id: n.id,
          argument: n.argument || '',
        })),
        // setup: (values.beforeFuncs || []).map((n: any) => n.id),
        // teardown: (values.afterFuncs || []).map((n: any) => n.id),
      },
      resAssert: values.resAssert || [],
      modifyUser: userInfo.userName,
    };

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
  };

  const gotoNextStep = async () => {
    setSetp(step + 1);
  };

  return (
    <Drawer
      title={props.mode === 'EDIT' ? '编辑用例' : '新增用例'}
      visible={props.mode !== 'HIDE'}
      maskClosable={false}
      onClose={props.onCancel}
      placement="right"
      width={900}
      className="test-case-editor"
      footer={
        <div className="case-editor-footer">
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
          {step === 4 ? (
            <Button type="primary" onClick={handleSubmit}>
              提交
            </Button>
          ) : null}
          <Button type="default" onClick={props.onCancel}>
            取消
          </Button>
        </div>
      }
    >
      <Form form={editField}>
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
            <FuncTableField title="前置函数" />
          </FormItem>
          <FormItem noStyle name="beforeCases">
            <CaseTableField title="前置用例" />
          </FormItem>
          <FormItem noStyle name="afterFuncs">
            <FuncTableField title="后置函数" />
          </FormItem>
        </div>

        {/* step 1 定义变量 */}
        <div className="case-editor-step case-editor-step-1" data-visible={step === 1}>
          <FormItem name="customVars" noStyle initialValue={[]}>
            <TableForm
              columns={[
                { title: '变量名', dataIndex: 'key', required: true },
                {
                  title: '类型',
                  dataIndex: 'type',
                  required: true,
                  valueType: 'select',
                  valueEnum: VALUE_TYPE_ENUM,
                },
                { title: '值', dataIndex: 'value' },
                { title: '描述', dataIndex: 'desc' },
              ]}
            />
          </FormItem>
        </div>

        {/* step 2 请求内容 */}
        <div className="case-editor-step case-editor-step-2" data-visible={step === 2}>
          <Tabs defaultActiveKey="parameters">
            <Tabs.TabPane key="parameters" tab="parameters" forceRender>
              <FormItem label="参数格式">
                <Radio.Group
                  options={['array', 'object']}
                  value={paramType}
                  onChange={(e) => setParamType(e.target.value)}
                />
              </FormItem>
              {paramType == 'array' ? (
                <FormItem name="parameters" noStyle initialValue={[]}>
                  <TableForm
                    columns={[
                      { title: 'key', dataIndex: 'key', required: true },
                      { title: 'value', dataIndex: 'value' },
                      { title: '描述', dataIndex: 'desc' },
                    ]}
                  />
                </FormItem>
              ) : (
                <FormItem name="parametersJSON" noStyle>
                  <Input.TextArea placeholder="请输入" rows={10} />
                </FormItem>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane key="headers" tab="headers" forceRender>
              <FormItem name="headers" noStyle initialValue={[]}>
                <TableForm
                  columns={[
                    { title: 'key', dataIndex: 'key', required: true },
                    { title: 'value', dataIndex: 'value' },
                    { title: '描述', dataIndex: 'desc' },
                  ]}
                />
              </FormItem>
            </Tabs.TabPane>
          </Tabs>
        </div>

        {/* step 3 保存返回值 */}
        <div className="case-editor-step case-editor-step-3" data-visible={step === 3}>
          <FormItem name="savedVars" noStyle initialValue={[]}>
            <TableForm
              columns={[
                { title: '变量名', dataIndex: 'name', required: true },
                { title: '表达式', dataIndex: 'jsonpath', required: true },
                { title: '描述', dataIndex: 'desc' },
              ]}
            />
          </FormItem>
        </div>

        {/* step 4 结果断言 */}
        <div className="case-editor-step case-editor-step-4" data-visible={step === 4}>
          <FormItem name="resAssert" noStyle initialValue={[]}>
            <TableForm
              columns={[
                { title: '断言项', dataIndex: 'assertName', required: true },
                {
                  title: '比较符',
                  dataIndex: 'compare',
                  required: true,
                  valueType: 'select',
                  valueEnum: ASSERT_COMPARE_ENUM,
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                  required: true,
                  valueType: 'select',
                  valueEnum: VALUE_TYPE_ENUM,
                },
                { title: '期望值', dataIndex: 'value', required: true },
              ]}
            />
          </FormItem>
        </div>
      </Form>
    </Drawer>
  );
}
