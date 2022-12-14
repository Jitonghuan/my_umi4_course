// 集群容灾
// @author JITONGHUAN <moyan@come-future.com>
// @create 2022/11/24 10:10

import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import {history, useLocation,Outlet } from 'umi';
import { FilterCard } from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';

const activeKeyMap: Record<string, any> = {
  'cluster-sync-detail': 'cluster-sync',
};

export default function Dashboard(props: any) {
  let location:any = useLocation();
  const currRoute = /\/([\w-]+)$/.exec(location.pathname)?.[1];
  const activeKey = activeKeyMap[currRoute!] || currRoute;

  return (
    <PageContainer>
      <FilterCard className="layout-compact">
        <Tabs activeKey={activeKey} onChange={(next) => history.push(`/matrix/cluster-recovery/cluster-sync/${next}`)}>
          <Tabs.TabPane tab="全量同步" key="full" />
          <Tabs.TabPane tab="后端单应用同步" key="backend" />
          <Tabs.TabPane tab="前端单应用同步" key="front" />
          <Tabs.TabPane tab="Nacos配置同步" key="nacos" />
          <Tabs.TabPane tab="同步策略" key="policy" />
        </Tabs>
      </FilterCard>
      <VCPermission code={window.location.pathname} isShowErrorPage>
        <Outlet/>
      </VCPermission>
    </PageContainer>
  );
}
