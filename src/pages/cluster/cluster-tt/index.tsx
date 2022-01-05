// operation - cluster
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { FilterCard } from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';

const activeKeyMap: Record<string, any> = {
  'cluster-sync-detail': 'cluster-sync',
};

export default function Dashboard(props: any) {
  const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
  const activeKey = activeKeyMap[currRoute!] || currRoute;

  return (
    <PageContainer>
      <FilterCard className="layout-compact">
        <Tabs activeKey={activeKey} onChange={(next) => props.history.push(`/matrix/cluster/cluster-tt/${next}`)}>
          {/* <Tabs.TabPane tab="集群看板" key="dashboard" /> */}
          <Tabs.TabPane tab="集群看板" key="dashboards" />
          <Tabs.TabPane tab="流量调度" key="scheduling" />
          <Tabs.TabPane tab="集群同步" key="cluster-sync" />
          <Tabs.TabPane tab="应用同步" key="application-sync" />
          <Tabs.TabPane tab="操作记录" key="operation-log" />
        </Tabs>
      </FilterCard>
      <VCPermission code={window.location.pathname} isShowErrorPage>
        {props.children}
      </VCPermission>
    </PageContainer>
  );
}
