import React, { ReactNode } from 'react';

export interface IProps {
  appCode: string;
  /** 环境参数 */
  env: 'DEV' | 'TEST' | 'POC' | 'PRD';
}

export type DataSourceType = {
  id: React.Key;
  key?: string;
  value?: string;
};
