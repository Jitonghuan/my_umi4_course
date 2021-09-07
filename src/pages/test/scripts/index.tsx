// 脚本管理
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/09/06 10:19

import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { FilterCard } from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';

const activeKeyMap: Record<string, any> = {};

export default function Dashboard(props: any) {
  const currRoute = /\/([\w-]+)$/.exec(props.location.pathname)?.[1];
  const activeKey = activeKeyMap[currRoute!] || currRoute;

  return (
    <PageContainer>
      <FilterCard className="layout-compact">
        <Tabs activeKey={activeKey} onChange={(next) => props.history.push(`/matrix/test/scripts/${next}`)}>
          <Tabs.TabPane tab="函数管理" key="functions" />
          <Tabs.TabPane tab="SQL管理" key="sqls" />
        </Tabs>
      </FilterCard>
      <VCPermission code={window.location.pathname} isShowErrorPage>
        {props.children}
      </VCPermission>
    </PageContainer>
  );
}
