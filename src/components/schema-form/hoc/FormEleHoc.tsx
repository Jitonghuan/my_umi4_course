import React from 'react';
import type { InputProps } from 'antd/es/input';

import { INodeType } from '../type';

const defaultMap = {
  Input: {
    allowClear: true,
    placeholder: '请输入',
  },
  InputNumber: {
    placeholder: '请输入',
  },
  Select: {
    allowClear: true,
    placeholder: '请选择',
    showSearch: true,
    optionFilterProp: 'label',
  },
} as { [key: string]: any };

export default (WrappedComponent: React.ComponentClass | any, type: INodeType) => {
  const defaultProps = defaultMap[type];
  return (props: InputProps | any) => {
    const { customMap = {}, ...restProps } = props;
    const extraProps = type === 'Custom' ? { customMap } : {};
    return <WrappedComponent {...defaultProps} {...restProps} {...extraProps} />;
  };
};
