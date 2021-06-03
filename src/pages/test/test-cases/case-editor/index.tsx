// test case editor
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 20:15

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
} from 'antd';
import * as APIS from '../service';
import { CaseItemVO } from '../interfaces';
import './index.less';

export interface CaseEditorProps extends Record<string, any> {
  visible?: boolean;
  initData?: CaseItemVO;
  onCancel?: () => any;
  onSave?: () => any;
}

export default function CaseEditor(props: CaseEditorProps) {
  const [editField] = Form.useForm<Record<string, any>>();
  const [step, setSetp] = useState<number>(0);

  useEffect(() => {
    if (!props.visible) return;
    // TODO 初始化数据
  }, [props.visible]);

  const handleSubmit = useCallback(() => {
    console.log('>>> handleSubmit');
  }, []);

  const gotoNextStep = useCallback(() => {
    // TODO 先校验
    setSetp(step + 1);
  }, [step]);

  return (
    <Drawer
      title={props.initData ? '编辑用例' : '新增用例'}
      visible={props.visible}
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
        <Form.Item label="用例描述" labelCol={{ flex: '72px' }}>
          <Input placeholder="请输入用例描述" />
        </Form.Item>
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
          前端/后置~~~
        </div>

        {/* step 1 定义变量 */}
        <div
          className="case-editor-step case-editor-step-1"
          data-visible={step === 1}
        >
          定义变量~~~
        </div>

        {/* step 2 请求内容 */}
        <div
          className="case-editor-step case-editor-step-2"
          data-visible={step === 2}
        >
          请求内容~~~
        </div>

        {/* step 3 保存返回值 */}
        <div
          className="case-editor-step case-editor-step-3"
          data-visible={step === 3}
        >
          保存返回值~~~
        </div>

        {/* step 4 结果断言 */}
        <div
          className="case-editor-step case-editor-step-4"
          data-visible={step === 4}
        >
          结果断言~~~
        </div>
      </Form>
    </Drawer>
  );
}
