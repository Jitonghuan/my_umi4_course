import { IPermission } from '@cffe/vc-layout/lib/sider-menu';
import React from 'react';

export interface IFEContent extends globalConfig {
  // 面包屑路由数据
  breadcrumbMap: any;
  // 应用分类数据
  categoryData?: any[];
  // 应用组
  businessData?: any[];
  // 环境类型枚举
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
