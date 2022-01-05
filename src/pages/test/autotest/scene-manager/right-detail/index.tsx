// right detail
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 15:59

import React, { useEffect } from 'react';
import { Empty } from 'antd';
import type Emitter from 'events';
import { ContentCard } from '@/components/vc-page-content';
import { TreeNode } from '../../interfaces';
import SceneList from './scene-list';
import SceneDetail from './scene-detail';
import './index.less';

interface RightDetailProps extends Record<string, any> {
  emitter: Emitter;
  /** 当前选中的模块 */
  current?: TreeNode;
}

export default function RightDetail(props: RightDetailProps) {
  useEffect(() => {}, []);

  if (!props.current) {
    return (
      <ContentCard className="page-scene-right-detail">
        <Empty description="请选择节点" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: '100px' }} />
      </ContentCard>
    );
  }

  if (props.current.level === 3) {
    return <SceneDetail emitter={props.emitter} current={props.current} defaultProjectId={props.curProjectId} />;
  }

  return <SceneList emitter={props.emitter} current={props.current} />;
}
