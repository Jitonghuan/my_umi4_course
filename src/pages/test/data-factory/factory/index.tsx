// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import HeaderTabs from '../components/header-tabs';
import * as APIS from './service';

export default function DataFactoryTemplate(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="factory" history={props.history} />
      <ContentCard>BOTTOM</ContentCard>
    </MatrixPageContent>
  );
}
