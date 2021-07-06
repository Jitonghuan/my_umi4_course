// import React from 'react';
import { Input, InputNumber, Select, DatePicker, Checkbox, Radio } from 'antd';

import ArrayComponent from '../components/Array';
import CustomComponent from '../components/Custom';

const { RangePicker } = DatePicker;

// 注册组件枚举
export const componentsEnum = [
  'Input',
  'InputNumber',
  'Select',
  'DatePicker',
  'RangePicker',
  'Checkbox',
  'Radio',
  'Custom', // 自定义扩展
  // 'Array',
];

// 表单元素的map
export default () => {
  return {
    Input,
    InputNumber,
    Select,
    DatePicker,
    RangePicker,
    Checkbox: Checkbox.Group,
    Radio: Radio.Group,
    Array: ArrayComponent,
    Custom: CustomComponent,
  } as any;
};
