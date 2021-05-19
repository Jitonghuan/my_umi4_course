import React, { CSSProperties, ReactNode } from 'react';
import { TableProps, FormItemProps, FormInstance } from 'antd/lib';
import { Moment } from 'moment';

export type TypeProps =
  | 'select'
  | 'input'
  | 'date'
  | 'range'
  | 'area'
  | 'inputNumber'
  | 'radio'
  | 'checkbox'
  | 'other';

export interface OptionProps {
  value: string;
  key: React.Key;
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
  key: string;
  type: TypeProps;
  dataIndex?: string;
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
  onChange?: (e: T) => void;
}

export interface TableSearchProps extends TableProps<any> {
  formOptions: FormProps[];
  extraNode?: React.ReactNode;
  showSearch?: boolean;
  showReset?: boolean;
  searchText?: string;
  formLayout?: 'horizontal' | 'vertical' | 'inline';
  className?: string;
  showTableTitle?: boolean;
  tableTitle?: string;
  style?: CSSProperties;
  onSearch?: (value: Record<string, any>) => void;
  form?: FormInstance;
  reset?: () => void;
}
