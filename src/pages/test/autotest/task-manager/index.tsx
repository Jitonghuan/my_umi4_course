// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React from 'react';
import { Tabs } from 'antd';
import type { IUmiRrops } from '@cffe/fe-backend-component/es/components/end-layout/bus-layout';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard, CardRowGroup } from '@/components/vc-page-content';
import * as APIS from '../service';

export default function TaskManager(props: IUmiRrops) {
  return (
    <MatrixPageContent>
      <FilterCard className="layout-compact">
        <Tabs activeKey="tasks" onChange={(next) => props.history.push(`/matrix/test/autotest/${next}`)}>
          <Tabs.TabPane tab="用例管理" key="test-cases" />
          <Tabs.TabPane tab="场景管理" key="scenes" />
          <Tabs.TabPane tab="任务管理" key="tasks" />
        </Tabs>
      </FilterCard>
      <CardRowGroup>
        <CardRowGroup.SlideCard width={200}>LEFT</CardRowGroup.SlideCard>
        <ContentCard>任务管理</ContentCard>
      </CardRowGroup>
    </MatrixPageContent>
  );
}
