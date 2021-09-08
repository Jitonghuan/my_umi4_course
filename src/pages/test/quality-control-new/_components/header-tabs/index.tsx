import React from 'react';
import { Tabs } from 'antd';
import type { IUmiRrops } from '@cffe/vc-layout/es/bus-layout';
import { FilterCard } from '@/components/vc-page-content';

export interface HeaderTabsProps {
  activeKey:
    | 'overview'
    | 'tesk-list'
    | 'quality-scoring-rules'
    | 'global-control-point-rules'
    | 'app-control-point-rules';
  history: IUmiRrops['history'];
}

export default function HeaderTabs(props: HeaderTabsProps) {
  return (
    <FilterCard className="layout-compact">
      <Tabs
        activeKey={props.activeKey}
        onChange={(next) => props.history.push(`/matrix/test/quality-control-new/${next}`)}
      >
        <Tabs.TabPane tab="质量看板" key="overview" />
        <Tabs.TabPane tab="任务列表" key="tesk-list" />
        <Tabs.TabPane tab="质量分规则" key="quality-scoring-rules" />
        <Tabs.TabPane tab="全局卡点规则" key="global-control-point-rules" />
        <Tabs.TabPane tab="应用卡点规则" key="app-control-point-rules" />
      </Tabs>
    </FilterCard>
  );
}
