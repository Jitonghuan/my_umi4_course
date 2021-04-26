import { ReactNode } from 'react';

export interface IProps {
  /** 应用id */
  appId: string;
  /** 环境参数 */
  env: string;
  /** 配置的类型 boot启动参数，app应用配置 */
  configType: 'boot' | 'app';
  appCode: string;
}

// 版本明细
export interface IVersionDetail {
  id: string;
  key: string;
  value?: string;
}
