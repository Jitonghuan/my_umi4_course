// 上下布局页面
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/05/30 10:10

import React, { useState, useMemo } from 'react';
import Emitter from 'events';
import { CardRowGroup } from '@/components/vc-page-content';
import { TreeNode } from '../interfaces';
import LeftTree from './left-tree';
import RightDetail from './right-detail';
import './index.less';

export default function SceneManager() {
  const [current, setCurrent] = useState<TreeNode>();
  const [searchProject, setSearchProject] = useState<number>();

  const emitter = useMemo(() => {
    return new Emitter();
  }, []);

  return (
    <CardRowGroup className="page-autotest-scene">
      <LeftTree
        emitter={emitter}
        onItemClick={(item) => setCurrent(item)}
        searchProject={searchProject}
        setSearchProject={setSearchProject}
      />
      <RightDetail key={current?.key || 1} current={current} emitter={emitter} curProjectId={searchProject} />
    </CardRowGroup>
  );
}
