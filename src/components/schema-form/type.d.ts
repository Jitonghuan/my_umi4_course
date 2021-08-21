import type { FormItemProps } from 'antd/lib/form';

// node type
export type INodeType =
  | 'Input'
  | 'InputNumber'
  | 'Select'
  | 'DatePicker'
  | 'RangePicker'
  | 'Checkbox'
  | 'Radio'
  | 'Array'
  | 'Custom';

// form-item props
export interface IFormItemProps extends FormItemProps {
  options?: { label: string; value: string | number | boolean }[];
}

// schema item
export type ISchemaItem = {
  type: INodeType;
  props?: IFormItemProps;
  customMap?: { [key: string]: React.ReactNode };
};

// 表单元素通用默认属性申明
export declare namespace FEFormRef {
  export interface IInput {
    label?: string;
    placeholder?: string;
    allowClear?: boolean;
  }

  export interface ISelect {
    label?: string;
    placeholder?: string;
    allowClear?: boolean;
  }

  export interface IInputNumber {
    label?: string;
    placeholder?: string;
  }
}
