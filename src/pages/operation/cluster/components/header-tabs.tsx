// header tab
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/07/14 15:24

import React from 'react';
import { Tabs } from 'antd';
import type { IUmiRrops } from '@cffe/vc-layout/es/bus-layout';
import { FilterCard } from '@/components/vc-page-content';

export interface HeaderTabsProps {
  activeKey: 'group-view' | 'traffic-scheduling' | 'cluster-synchro' | 'application-synchro' | 'operation-log';
  history: IUmiRrops['history'];
}

export default function HeaderTabs(props: HeaderTabsProps) {
  const { TabPane } = Tabs;
  function callback(key: any) {
    console.log(key);
  }
  return (
    <FilterCard className="layout-compact">
      <Tabs activeKey={props.activeKey} onChange={(next) => props.history.push(`/matrix/operation/cluster/${next}`)}>
        <Tabs.TabPane tab="集群看板" key="group-view" />
        <Tabs.TabPane tab="流量调度" key="traffic-scheduling" />
        <Tabs.TabPane tab="集群同步" key="cluster-synchro" />
        <Tabs.TabPane tab="应用同步" key="application-synchro" />
        <Tabs.TabPane tab="操作日志" key="operation-log" />
      </Tabs>
    </FilterCard>
  );
}
