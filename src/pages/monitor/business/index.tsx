// business monitor index
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import { Tabs } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { FilterCard } from '@/components/vc-page-content';

const activeKeyMap: Record<string, any> = {
  'prometheus-add': 'prometheus',
  'prometheus-edit': 'prometheus',
};

export default function Dashboard(props: any) {
  const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
  const activeKey = activeKeyMap[currRoute!] || currRoute;

  return (
    <MatrixPageContent>
      <FilterCard className="layout-compact">
        <Tabs activeKey={activeKey} onChange={(next) => props.history.push(`/matrix/monitor/business/${next}`)}>
          <Tabs.TabPane tab="接口方式接入" key="prometheus" />
          <Tabs.TabPane tab="日志方式接入" key="logger-alarm" />
        </Tabs>
      </FilterCard>
      {props.children}
    </MatrixPageContent>
  );
}
