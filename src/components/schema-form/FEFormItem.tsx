import React from 'react';
import { Form } from 'antd';

import useComponents from './hooks/useComponents';
import useDefaultStyle from './hooks/useDefaultStyle';
import FormEleHoc from './hoc/FormEleHoc';

import { ISchemaItem } from './type';

/**
 * form-item
 */
export default (itemProps: ISchemaItem) => {
  const { type, props = {}, customMap } = itemProps;
  const { className = '', name, label = '', required, rules = [], extra, initialValue, ...rest } = props || {};

  const FormEleMap = useComponents(); // 表单元素 map
  const defaultItemStyle = useDefaultStyle('formitem', { className }); // formItem className
  const defaultNodeStyle = useDefaultStyle(type);

  const formItemProps = { name, label, required, rules, extra, initialValue };

  // 处理 required 属性
  if (required) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    rules.unshift({ required: true, message: `${label}必填!` });
  }

  const CurNode = FormEleHoc(FormEleMap[type], type);

  return (
    <Form.Item {...defaultItemStyle} {...formItemProps}>
      <CurNode {...defaultNodeStyle} {...rest} customMap={customMap} />
    </Form.Item>
  );
};
