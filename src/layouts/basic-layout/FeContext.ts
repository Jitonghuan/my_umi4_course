import { IPermission } from '@cffe/vc-layout/lib/sider-menu';
import React from 'react';

export interface IFEContent extends globalConfig {
  // 面包屑路由数据
  breadcrumbMap: any;
  // 所属数据
  categoryData?: any[];
  // 业务线枚举
  businessData?: any[];
  // 环境枚举
  envData?: any[];
  // 是否开启权限
  isOpenPermission?: boolean;
  // 权限数据
  permissionData?: IPermission[];
}

export default React.createContext<IFEContent>({
  title: '',
  favicon: '',
  logo: '',
  copyright: '',
  breadcrumbMap: {},
  categoryData: [],
  businessData: [],
  envData: [],
  isOpenPermission: false,
  permissionData: [],
});
