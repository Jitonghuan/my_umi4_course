// header tab
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 20:24

import React from 'react';
import { Tabs } from 'antd';
import type { IUmiRrops } from '@cffe/vc-layout/es/bus-layout';
import { FilterCard } from '@/components/vc-page-content';

export interface HeaderTabsProps {
  activeKey: 'records' | 'factory';
  history: IUmiRrops['history'];
}

export default function HeaderTabs(props: HeaderTabsProps) {
  return (
    <FilterCard className="layout-compact">
      <Tabs activeKey={props.activeKey} onChange={(next) => props.history.push(`/matrix/test/data-factory/${next}`)}>
        <Tabs.TabPane tab="数据生成记录" key="records" />
        <Tabs.TabPane tab="数据工厂列表" key="factory" />
      </Tabs>
    </FilterCard>
  );
}
