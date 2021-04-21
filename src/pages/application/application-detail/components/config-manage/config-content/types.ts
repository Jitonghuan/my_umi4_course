import { ReactNode } from 'react';

export interface IProps {
  /** 环境参数 */
  env: 'DEV' | 'TEST' | 'POC' | 'PRD';
}
