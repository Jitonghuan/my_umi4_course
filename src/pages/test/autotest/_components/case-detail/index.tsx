// test case detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 20:15

import React, { useState, useEffect } from 'react';
import { Drawer, Table, Form, Steps, Input } from 'antd';
import { CaseItemVO, FuncProps } from '../../interfaces';
import FuncTableField from './func-table-field';
import CaseTableField from './case-table-field';
import { getFuncListByIds, getCaseListByIds } from '../case-editor/common';
import AceEditor from '@/components/ace-editor';
import '../case-editor/index.less';

const { Item: FormItem } = Form;

interface DisplayDataProps {
  name: string;
  desc: string;
  beforeFuncs: Record<string, any>[];
  afterFuncs: Record<string, any>[];
  beforeCases: CaseItemVO[];
  customVars: { key: string; type: string; value?: string; desc?: string }[];
  headers: { key: string; value?: string }[];
  paramType: 'json' | 'form';
  parameters?: { key: string; value: string; desc?: string }[];
  parametersJSON?: string;
  savedVars: { name: string; jsonpath?: string }[];
  resAssert: {
    assertName: string;
    compare: string;
    type: string;
    value: string;
  }[];
}

async function initDisplayData(initData: CaseItemVO): Promise<DisplayDataProps> {
  const hooks = initData.hooks ? JSON.parse(initData.hooks) : {};
  const beforeFuns: FuncProps[] = hooks.setup || [];
  const afterFuncs: FuncProps[] = hooks.teardown || [];
  const beforeCaseIds: number[] = initData.preStep ? initData.preStep.split(',').map((n: string) => +n) : [];
  const nextParamType = typeof initData.parameters === 'string' ? 'json' : 'form';

  return {
    name: initData.name,
    desc: initData.desc,
    beforeFuncs: await getFuncListByIds(beforeFuns),
    afterFuncs: await getFuncListByIds(afterFuncs),
    beforeCases: await getCaseListByIds(beforeCaseIds),
    customVars: initData.customVars || [],
    headers: initData.headers || [],
    paramType: nextParamType,
    parameters: nextParamType === 'form' ? initData.parameters || [] : [],
    parametersJSON: nextParamType === 'json' ? initData.parameters || '' : '',
    savedVars: initData.savedVars || [],
    resAssert: initData.resAssert || [],
  };
}

export interface CaseEditorProps extends Record<string, any> {
  data?: CaseItemVO;
  onClose?: () => any;
}

export default function CaseEditor(props: CaseEditorProps) {
  const [step, setSetp] = useState<number>(0);
  const [displayData, setDisplayData] = useState<DisplayDataProps>();

  useEffect(() => {
    if (!props.data) return;

    initDisplayData(props.data).then((nextData) => {
      setDisplayData(nextData);
    });
  }, [props.data]);

  if (!props.data || !displayData) return null;

  return (
    <Drawer
      title={`用例详情 - ${props.data.id}`}
      visible
      maskClosable={false}
      onClose={props.onClose}
      placement="right"
      width={900}
      className="test-case-detail"
    >
      <Form>
        <FormItem label="用例名称" labelCol={{ flex: '76px' }}>
          <div className="ant-form-text">{displayData.name}</div>
        </FormItem>
        <FormItem label="用例描述" labelCol={{ flex: '76px' }}>
          <div className="and-form-text">{displayData.desc || '--'}</div>
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
          <FuncTableField title="前置函数" data={displayData.beforeFuncs} />
          <CaseTableField title="前置用例" data={displayData.beforeCases} />
          <FuncTableField title="后置函数" data={displayData.afterFuncs} />
        </div>

        {/* step 1 定义变量 */}
        <div className="case-editor-step case-editor-step-1" data-visible={step === 1}>
          <Table dataSource={displayData.customVars} pagination={false}>
            <Table.Column dataIndex="key" title="变量名" />
            <Table.Column dataIndex="type" title="类型" />
            <Table.Column dataIndex="value" title="值" />
            <Table.Column dataIndex="desc" title="描述" />
          </Table>
        </div>

        {/* step 2 请求内容 */}
        <div className="case-editor-step case-editor-step-2" data-visible={step === 2}>
          <div className="case-table-field">
            <div className="field-caption">
              <h3>parameters</h3>
            </div>
            {displayData.paramType == 'form' ? (
              <Table dataSource={displayData.parameters} pagination={false}>
                <Table.Column title="key" dataIndex="key" />
                <Table.Column title="value" dataIndex="value" />
                <Table.Column title="描述" dataIndex="desc" />
              </Table>
            ) : (
              <AceEditor mode="json" value={displayData.parametersJSON || ''} height={220} readOnly />
            )}
          </div>
          <div className="case-table-field">
            <div className="field-caption">
              <h3>headers</h3>
            </div>
            <Table dataSource={displayData.headers} pagination={false}>
              <Table.Column title="key" dataIndex="key" />
              <Table.Column title="value" dataIndex="value" />
              <Table.Column title="描述" dataIndex="desc" />
            </Table>
          </div>
        </div>

        {/* step 3 保存返回值 */}
        <div className="case-editor-step case-editor-step-3" data-visible={step === 3}>
          <Table dataSource={displayData.savedVars} pagination={false}>
            <Table.Column title="变量名" dataIndex="name" />
            <Table.Column title="表达式" dataIndex="jsonpath" />
            <Table.Column title="描述" dataIndex="desc" />
          </Table>
        </div>

        {/* step 4 结果断言 */}
        <div className="case-editor-step case-editor-step-4" data-visible={step === 4}>
          <Table dataSource={displayData.resAssert} pagination={false}>
            <Table.Column title="断言项" dataIndex="assertName" />
            <Table.Column title="比较符" dataIndex="compare" />
            <Table.Column title="类型" dataIndex="type" />
          </Table>
        </div>
      </Form>
    </Drawer>
  );
}
