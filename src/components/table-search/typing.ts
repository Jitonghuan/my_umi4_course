import React, { CSSProperties, ReactNode } from 'react';
import type { TableProps, FormItemProps, FormInstance } from 'antd/lib';

export type TypeProps = 'select' | 'input' | 'date' | 'range' | 'area' | 'inputNumber' | 'radio' | 'checkbox' | 'other';
//
export interface OptionProps {
  value: any;
  label: any;
  key: any;
  renderLabel?: boolean;
}

export interface CheckboxOptionProps {
  value: string;
  label: string;
  disable?: boolean;
}

export interface TextAreaProps {
  autoSize?: { minRows?: number; maxRows?: number };
}

export interface FormProps<T = any> extends FormItemProps, TextAreaProps {
  key: any;
  type: TypeProps;
  dataIndex?: any;
  renderLabel?:boolean;
  label?: string;
  option?: OptionProps[];
  checkboxOption?: CheckboxOptionProps[];
  style?: CSSProperties;
  itemStyle?: CSSProperties;
  placeholder?: string;
  defaultValue?: any;
  showTime?: boolean;
  width?: string | number;
  showSelectSearch?: boolean;
  disable?: boolean;
  extraForm?: ReactNode;
  className?: string;
  validatorMessage?: string;
  pattern?: RegExp;
  rules?:any;
  isReadOnly?: boolean;
  mode?: 'multiple' | 'tags';
  id?: string;
  min?: number;
  max?: number;
  onChange?: (e: T) => void;
  allowClear?: boolean;
}

export interface TableSearchProps extends TableProps<any> {
  formOptions: FormProps[];
  extraNode?: React.ReactNode;
  bottomRender?:React.ReactNode;
  showSearch?: boolean;
  showReset?: boolean;
  searchText?: string;
  formLayout?: 'horizontal' | 'vertical' | 'inline';
  className?: string;
  showTableTitle?: boolean;
  tableTitle?: string;
  style?: CSSProperties;
  onSearch?: () => void;
  form?: FormInstance;
  /** 是否是分离式布局，默认是 */
  splitLayout?: boolean;
  reset?: () => void;
  formExtraNode?: React.ReactNode;
}
