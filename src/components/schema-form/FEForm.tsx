import React from 'react';
import { Button, Form } from 'antd';
import type { FormProps } from 'antd/es/form';

import useDefaultStyle from './hooks/useDefaultStyle';
import type { FormInstance } from 'antd/lib/form';

// form props
export interface IProps extends FormProps {
  /** 数据源 */
  dataSource?: { [key: string]: any };
  /** labelCol.span */
  labelColSpan?: number;
  /** 是否显示重置按钮 */
  isShowReset?: boolean;
  /** onFinish 重写 */
  onFinish?: (val: any, form?: FormInstance<any>) => void;
  /** reset */
  onReset: () => void;
  /** 提交按钮文案 */
  submitText?: string;
  /** 重置按钮文案 */
  resetText?: string;
}

/**
 * 表单容器
 * @create 2021-01-02 21:48
 */
const FormWrap = (props: IProps) => {
  const [form] = Form.useForm();
  const {
    labelColSpan,
    children,
    isShowReset,
    onFinish: _onFinish,
    onReset: _onReset,
    dataSource = {},
    submitText,
    resetText,
    ...rest
  } = props;
  const { layout } = rest;
  const defaultStyleProps = useDefaultStyle('form');

  // 默认表单行layout处理
  const defaultFormProps =
    layout === 'horizontal' && labelColSpan
      ? {
          labelCol: { span: labelColSpan },
          wrapperCol: { span: 24 - labelColSpan },
        }
      : {};

  // 按钮模块
  const btnFormProps =
    layout === 'horizontal' && labelColSpan
      ? {
          wrapperCol: { span: 24 - labelColSpan, offset: labelColSpan },
        }
      : {};

  // 重置
  const onReset = () => {
    form.resetFields();
    _onReset && _onReset();
  };

  const onFinish = (val: any) => {
    _onFinish && _onFinish(val, form);
  };

  return (
    <Form
      form={form}
      {...defaultStyleProps}
      {...defaultFormProps}
      {...rest}
      onFinish={onFinish}
      initialValues={dataSource}
    >
      {children}

      <Form.Item {...btnFormProps}>
        <Button htmlType="submit" type="primary">
          {submitText || '提交'}
        </Button>
        {isShowReset && (
          <Button htmlType="button" style={{ marginLeft: '24px' }} onClick={onReset}>
            {resetText || '重置'}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default FormWrap;
