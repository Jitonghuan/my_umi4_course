import { ReactNode } from 'react';

export interface IProps {}

export interface ConfigData {
  /** 数据库自增ID */
  id: number;
  /** key */
  key?: string;
  /** value */
  value?: string;
}
