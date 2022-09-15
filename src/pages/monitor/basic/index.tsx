// 基础监控
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/16 19:51

import React from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { FilterCard } from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';
import { history,useLocation } from 'umi';

const activeKeyMap: Record<string, any> = {};

export default function Dashboard(props: any) {
  let location:any = useLocation();
  const currRoute = /\/([\w-]+)$/.exec(location.pathname)?.[1];
  const activeKey = activeKeyMap[currRoute!] || currRoute;

  return (
    <PageContainer>
      <FilterCard className="layout-compact">
        <Tabs activeKey={activeKey} onChange={(next) => history.push(`/matrix/monitor/basic/${next}`)}>
          <Tabs.TabPane tab="服务接入" key="prometheus" />
          {/* <Tabs.TabPane tab="报警配置" key="alarm-rules" /> */}
        </Tabs>
      </FilterCard>
      <VCPermission code={window.location.pathname} isShowErrorPage>
        {props.children}
      </VCPermission>
    </PageContainer>
  );
}
