// header tab
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 20:24

import React from 'react';
import { Tabs } from 'antd';
import type { IUmiRrops } from '@cffe/vc-layout/es/bus-layout';
import { FilterCard } from '@/components/vc-page-content';

export interface HeaderTabsProps {
  activeKey: 'prometheus' | 'logger-alarm' | 'logger-search';
  history: IUmiRrops['history'];
}

export default function HeaderTabs(props: HeaderTabsProps) {
  return (
    <FilterCard className="layout-compact">
      <Tabs activeKey={props.activeKey} onChange={(next) => props.history.push(`/matrix/monitor/business/${next}`)}>
        <Tabs.TabPane tab="Prometheus监控" key="prometheus" />
        <Tabs.TabPane tab="日志搜索" key="logger-search" />
        <Tabs.TabPane tab="日志告警" key="logger-alarm" />
      </Tabs>
    </FilterCard>
  );
}
