import React from 'react';

export interface IFEContent extends globalConfig {
  // 面包屑路由数据
  breadcrumbMap: any;
  // 所属数据
  belongData?: any[];
  // 业务线枚举
  businessData?: any[];
  // 环境枚举
  envData?: any[];
}

export default React.createContext<IFEContent>({
  title: '',
  favicon: '',
  logo: '',
  copyright: '',
  breadcrumbMap: {},
  belongData: [],
  businessData: [],
  envData: [],
});
