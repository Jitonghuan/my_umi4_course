import React from 'react';
import MatrixPageContent from '@/components/matrix-page-content';
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
    <MatrixPageContent>
      <AppTable />
    </MatrixPageContent>
  );
};

export default Coms;
