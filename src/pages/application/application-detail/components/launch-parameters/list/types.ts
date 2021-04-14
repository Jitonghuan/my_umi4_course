import { ReactNode } from 'react';

export interface IProps {
  className?: string;
  width?: number | string;
  contentHeight?: number | string;
  title: string | ReactNode;
  dataSource: Array<{
    name: string;
    value: string;
  }>;
  footer: string | ReactNode;
  bordered?: boolean;
}
