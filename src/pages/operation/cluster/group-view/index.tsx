// 上下布局页面 双集群管理
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/14 16:30

import React from 'react';
import {} from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard } from '@/components/vc-page-content';
import HeaderTabs from '../components/header-tabs';
// import * as APIS from '../service';

export default function Dashboard(props: any) {
  return (
    <MatrixPageContent>
      <HeaderTabs activeKey="group-view" history={props.history} />
      <ContentCard>集群看板</ContentCard>
    </MatrixPageContent>
  );
}
