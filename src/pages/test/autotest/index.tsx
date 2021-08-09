// autotest
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import { Tabs } from 'antd';
import MatrixPageContent from '@/components/matrix-page-content';
import { FilterCard } from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';

const activeKeyMap: Record<string, any> = {};

export default function Dashboard(props: any) {
  const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
  const activeKey = activeKeyMap[currRoute!] || currRoute;

  return (
    <MatrixPageContent>
      <FilterCard className="layout-compact">
        <Tabs activeKey={activeKey} onChange={(next) => props.history.push(`/matrix/test/autotest/${next}`)}>
          <Tabs.TabPane tab="看板统计" key="dashboard" />
          <Tabs.TabPane tab="用例管理" key="test-cases" />
          <Tabs.TabPane tab="场景管理" key="scenes" />
          <Tabs.TabPane tab="任务管理" key="tasks" />
        </Tabs>
      </FilterCard>
      <VCPermission code={window.location.pathname} isShowErrorPage>
        {props.children}
      </VCPermission>
    </MatrixPageContent>
  );
}
