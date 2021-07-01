// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../components/header-tabs';
import * as APIS from '../service';

export default function Dashboard(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="dashboard" history={props.history} />
      <ContentCard>看板统计</ContentCard>
    </MatrixPageContent>
  );
}
