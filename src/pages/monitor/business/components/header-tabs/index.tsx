// header tab
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 20:24

import React from 'react';
import { Tabs } from 'antd';
import type { IUmiRrops } from '@cffe/vc-layout/es/bus-layout';
import { FilterCard } from '@/components/vc-page-content';

export interface HeaderTabsProps {
  activeKey: 'prometheus' | 'logger-alarm';
  history: IUmiRrops['history'];
}

export default function HeaderTabs(props: HeaderTabsProps) {
  return (
    <FilterCard className="layout-compact">
      <Tabs activeKey={props.activeKey} onChange={(next) => props.history.push(`/matrix/monitor/business/${next}`)}>
        <Tabs.TabPane tab="接口方式接入" key="prometheus" />
        {/* <Tabs.TabPane tab="日志方式接入" key="logger-alarm" /> */}
      </Tabs>
    </FilterCard>
  );
}
