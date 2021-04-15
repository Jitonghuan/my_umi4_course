import React from 'react';
import { Card } from 'antd';
import MatrisPageContent from '@/components/matris-page-content';

export interface IProps {
  /** 属性描述 */
  [key: string]: any;
}

/**
 * Details
 * @description 代码管理排行详情页面
 * @create 2021-04-15 16:34:46
 */
const Coms = (props: IProps) => {
  return (
    <MatrisPageContent className="code-details">
      <Card style={{ height: '100%' }}>1</Card>
    </MatrisPageContent>
  );
};

export default Coms;
