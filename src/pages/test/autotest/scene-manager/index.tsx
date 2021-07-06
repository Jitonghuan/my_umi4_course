// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useMemo } from 'react';
import Emitter from 'events';
import MatrixPageContent from '@/components/matrix-page-content';
import { CardRowGroup } from '@/components/vc-page-content';
import { TreeNode } from '../interfaces';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import HeaderTabs from '../components/header-tabs';
import './index.less';

export default function SceneManager(props: any) {
  const [current, setCurrent] = useState<TreeNode>();

  const emitter = useMemo(() => {
    return new Emitter();
  }, []);

  return (
    <MatrixPageContent className="page-autotest-scene">
      <HeaderTabs activeKey="scenes" history={props.history} />
      <CardRowGroup>
        <LeftTree emitter={emitter} onItemClick={(item) => setCurrent(item)} />
        <RightDetail key={current?.key || 1} current={current} emitter={emitter} />
      </CardRowGroup>
    </MatrixPageContent>
  );
}
