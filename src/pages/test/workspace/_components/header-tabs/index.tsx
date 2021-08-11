import React from 'react';
import { Tabs } from 'antd';
import type { IUmiRrops } from '@cffe/vc-layout/es/bus-layout';
import { FilterCard } from '@/components/vc-page-content';

export interface HeaderTabsProps {
  activeKey: 'test-case-library' | 'test-plan' | 'bug-manage';
  history: IUmiRrops['history'];
}

export default function HeaderTabs(props: HeaderTabsProps) {
  // TODO: 路由随便搞的，等设计稿出来记得改
  return (
    <FilterCard className="layout-compact">
      <Tabs activeKey={props.activeKey} onChange={(next) => props.history.push(`/matrix/test/workspace/${next}`)}>
        <Tabs.TabPane tab="测试用例库" key="test-case-library" />
        <Tabs.TabPane tab="测试计划" key="test-plan" />
        <Tabs.TabPane tab="Bug跟踪" key="bug-manage" />
      </Tabs>
    </FilterCard>
  );
}
