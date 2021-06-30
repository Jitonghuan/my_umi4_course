// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useCallback, useMemo, useLayoutEffect, useRef } from 'react';
import Emitter from 'events';
import { Tabs } from 'antd';
import type { IUmiRrops } from '@cffe/fe-backend-component/es/components/end-layout/bus-layout';
import MatrixPageContent from '@/components/matrix-page-content';
import { ContentCard, FilterCard, CardRowGroup } from '@/components/vc-page-content';
import { EditorMode, TreeNode } from '../interfaces';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import './index.less';

export default function SceneManager(props: IUmiRrops) {
  const [current, setCurrent] = useState<TreeNode>();

  const emitter = useMemo(() => {
    return new Emitter();
  }, []);

  return (
    <MatrixPageContent className="page-autotest-scene">
      <FilterCard className="layout-compact">
        <Tabs activeKey="scenes" onChange={(next) => props.history.push(`/matrix/test/autotest/${next}`)}>
          <Tabs.TabPane tab="用例管理" key="test-cases" />
          <Tabs.TabPane tab="场景管理" key="scenes" />
          <Tabs.TabPane tab="任务管理" key="tasks" />
        </Tabs>
      </FilterCard>
      <CardRowGroup>
        <LeftTree onItemClick={(item) => setCurrent(item)} emitter={emitter} />
        <RightDetail key={current?.key || 1} current={current} emitter={emitter} />
      </CardRowGroup>
    </MatrixPageContent>
  );
}
