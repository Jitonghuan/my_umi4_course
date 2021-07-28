// 集群看板
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/07/27 14:34

import React from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../_components/header-tabs';

export default function Dashboard(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="dashboard" history={props.history} />
      <ContentCard>集群看板</ContentCard>
    </MatrixPageContent>
  );
}
