import React, { CSSProperties } from 'react';
import { TableProps } from 'antd/lib/table';
import { FormItemProps } from 'antd/lib/form';
export type TypeProps = 'select' | 'input' | 'date';

export interface OptionProps {
  value: string;
  key: string;
}

export interface FormProps<T = any> extends FormItemProps {
  key: string;
  type: TypeProps;
  label: string;
  dataIndex: string;
  option?: OptionProps[];
  style?: CSSProperties;
  placeholder?: string;
  defaultValue?: string;
  showTime?: boolean;
  width?: string | number;
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
