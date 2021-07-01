// 左侧定位到场景时右侧显示场景详情（用例列表）
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/06/30 20:48

import React from 'react';
import {} from 'antd';
import type Emitter from 'events';
import { ContentCard } from '@/components/vc-page-content';
import { TreeNode } from '../../interfaces';

export interface SceneDetailProps extends Record<string, any> {
  emitter: Emitter;
  /** 当前选中的节点 */
  current?: TreeNode;
}

export default function SceneDetail(props: SceneDetailProps) {
  return <ContentCard>场景详情</ContentCard>;
}
