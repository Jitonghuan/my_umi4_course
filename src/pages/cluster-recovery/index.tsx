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
        <Tabs activeKey={activeKey} onChange={(next) => history.push(`/matrix/cluster-recovery/${next}`)}>
          <Tabs.TabPane tab="集群大盘" key="dashboards" />
          <Tabs.TabPane tab="流量调度" key="scheduling-mode" />
          <Tabs.TabPane tab="集群同步" key="cluster-sync" />
          <Tabs.TabPane tab="策略配置" key="policy-config" />
          <Tabs.TabPane tab="操作记录" key="operation-log" />
        </Tabs>
      </FilterCard>
      <VCPermission code={window.location.pathname} isShowErrorPage>
        {/* {props.children} */}
        <Outlet/>
      </VCPermission>
    </PageContainer>
  );
}
