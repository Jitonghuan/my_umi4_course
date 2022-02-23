import React, { ReactNode } from 'react';

export interface IProps {
  children: ReactNode;
  location: {
    pathname: string;
    query: {
      /** 配置的类型 boot启动参数，app应用配置 */
      type: 'boot' | 'app';
      /** 环境参数 */
      env: string;
    };
  };
  route: {
    name: string;
  };
}

export type DataSourceType = {
  id: React.Key;
  key?: string;
  value?: string;
};
