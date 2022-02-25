import { ReactNode } from 'react';

export interface IProps {
  children: ReactNode;
  location: {
    pathname: string;
    query: {
      id: string;
      appCode: string;
    };
  };
  route: {
    name: string;
  };
}

export interface ConfigData {
  /** 数据库自增ID */
  id: number;
  /** key */
  key: string;
  /** value */
  value: string;
}
