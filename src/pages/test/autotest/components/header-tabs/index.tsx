// header tab
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 20:24

import React from 'react';
import { Tabs } from 'antd';
import type { IUmiRrops } from '@cffe/vc-layout/es/bus-layout';
import { FilterCard } from '@/components/vc-page-content';

export interface HeaderTabsProps {
  activeKey: 'dashboard' | 'test-cases' | 'scenes' | 'tasks';
  history: IUmiRrops['history'];
}

export default function HeaderTabs(props: HeaderTabsProps) {
  return (
    <FilterCard className="layout-compact">
      <Tabs activeKey={props.activeKey} onChange={(next) => props.history.push(`/matrix/test/autotest/${next}`)}>
        {/* <Tabs.TabPane tab="看板统计" key="dashboard" /> */}
        <Tabs.TabPane tab="用例管理" key="test-cases" />
        {/* <Tabs.TabPane tab="场景管理" key="scenes" /> */}
        {/* <Tabs.TabPane tab="任务管理" key="tasks" /> */}
      </Tabs>
    </FilterCard>
  );
}
