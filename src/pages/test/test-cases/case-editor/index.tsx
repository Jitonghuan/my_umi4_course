// test case editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 20:15
// NOTE 用例编辑要提取到公共组件中，后期可能提供给其它业务模块使用

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import {
  Drawer,
  Form,
  Steps,
  Button,
  Input,
  Select,
  message,
  Table,
  Radio,
  Tabs,
} from 'antd';
import * as APIS from '../service';
import { CaseItemVO, EditorMode } from '../interfaces';
import FuncTableField from './func-table-field';
import CaseTableField from './case-table-field';
import TableForm from '@/components/simple-table-form';
import './index.less';

const { Item: FormItem } = Form;

export interface CaseEditorProps extends Record<string, any> {
  mode: EditorMode;
  initData?: CaseItemVO;
  onCancel?: () => any;
  onSave?: () => any;
}

export default function CaseEditor(props: CaseEditorProps) {
  const [editField] = Form.useForm<Record<string, any>>();
  const [step, setSetp] = useState<number>(0);
  const [paramType, setParamType] = useState<'object' | 'array'>('object');

  useEffect(() => {
    if (!props.visible) return;
    // TODO 初始化数据
  }, [props.visible]);

  const handleSubmit = useCallback(() => {
    console.log('>>> handleSubmit');
  }, []);

  const gotoNextStep = async () => {
    const values = await editField.validateFields();
    console.log('>>>>> gotoNextStep', values);

    // TODO 先校验
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
          label="用例描述"
          name="desc"
          labelCol={{ flex: '76px' }}
          rules={[{ required: false, message: '请输入用例描述' }]}
        >
          <Input placeholder="请输入用例描述" />
        </FormItem>
        <Steps current={step}>
          <Steps.Step title="前端/后置" />
          <Steps.Step title="定义变量" />
          <Steps.Step title="请求内容" />
          <Steps.Step title="保存返回值" />
          <Steps.Step title="结果断言" />
        </Steps>

        {/* step 0 前端/后置 */}
        <div
          className="case-editor-step case-editor-step-0"
          data-visible={step === 0}
        >
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
        <div
          className="case-editor-step case-editor-step-1"
          data-visible={step === 1}
        >
          <FormItem name="customVars" noStyle initialValue={[]}>
            <TableForm
              columns={[
                { title: '变量名', dataIndex: 'key', required: true },
                { title: '类型', dataIndex: 'type', required: true },
                { title: '值', dataIndex: 'value' },
                { title: '描述', dataIndex: 'desc' },
              ]}
            />
          </FormItem>
        </div>

        {/* step 2 请求内容 */}
        <div
          className="case-editor-step case-editor-step-2"
          data-visible={step === 2}
        >
          <Tabs defaultActiveKey="headers">
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
                <FormItem name="parameterJSON" noStyle>
                  <Input.TextArea placeholder="请输入" rows={10} />
                </FormItem>
              )}
            </Tabs.TabPane>
          </Tabs>
        </div>

        {/* step 3 保存返回值 */}
        <div
          className="case-editor-step case-editor-step-3"
          data-visible={step === 3}
        >
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
        <div
          className="case-editor-step case-editor-step-4"
          data-visible={step === 4}
        >
          <FormItem name="resAssert" noStyle initialValue={[]}>
            <TableForm
              columns={[
                { title: '断言项', dataIndex: 'assertName', required: true },
                { title: '比较符', dataIndex: 'compare', required: true },
                { title: '类型', dataIndex: 'type', required: true },
                { title: '期望值', dataIndex: 'value', required: true },
              ]}
            />
          </FormItem>
        </div>
      </Form>
    </Drawer>
  );
}
