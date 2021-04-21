import { ReactNode } from 'react';

export interface IProps {
  /** 环境参数 */
  env: 'DEV' | 'TEST' | 'POC' | 'PRD';
  /** 配置的类型 boot启动参数，app应用配置 */
  configType: 'boot' | 'app';
  appCode: string;
}
