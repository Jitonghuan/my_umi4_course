import React from 'react';
import PageContainer from '@/components/page-container';
import AppTable from './app-table';

import './index.less';

export interface IProps {
  /** 属性描述 */
  [key: string]: any;
}

/**
 * Application
 * @description 应用监控页面
 * @create 2021-04-12 19:15:42
 */
const Coms = (props: IProps) => {
  return (
    <PageContainer>
      <AppTable />
    </PageContainer>
  );
};

export default Coms;
