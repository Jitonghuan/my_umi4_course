import React, { CSSProperties, ReactNode } from 'react';
import { TableProps, FormItemProps } from 'antd/lib';
import { Moment } from 'moment';

export type TypeProps =
  | 'select'
  | 'input'
  | 'date'
  | 'area'
  | 'inputNumber'
  | 'radio'
  | 'other';

export interface OptionProps {
  value: string;
  key: React.Key;
}

export interface FormProps<T = any> extends FormItemProps {
  key: string;
  type: TypeProps;
  dataIndex: string;
  label?: string;
  option?: OptionProps[];
  style?: CSSProperties;
  itemStyle?: CSSProperties;
  placeholder?: string;
  defaultValue?: string | Moment | number;
  showTime?: boolean;
  width?: string | number;
  showSelectSearch?: boolean;
  disable?: boolean;
  extraForm?: ReactNode;
  className?: string;
  validatorMessage?: string;
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
}
