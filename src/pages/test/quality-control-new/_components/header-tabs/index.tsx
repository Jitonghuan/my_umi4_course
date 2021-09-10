import React from 'react';
import { Menu } from 'antd';
import type { IUmiRrops } from '@cffe/vc-layout/es/bus-layout';
import { FilterCard } from '@/components/vc-page-content';
import './index.less';

export interface HeaderTabsProps {
  activeKey:
    | 'overview'
    | 'tesk-list'
    | 'quality-scoring-rules'
    | 'global-control-point-rules'
    | 'app-control-point-rules';
  history: IUmiRrops['history'];
}

export default function HeaderTabs(props: HeaderTabsProps) {
  return (
    <FilterCard className="layout-compact">
      <Menu
        mode="horizontal"
        activeKey={props.activeKey}
        onClick={({ key: next }) => props.history.push(`/matrix/test/quality-control-new/${next}`)}
      >
        <Menu.Item key="overview">质量看板</Menu.Item>
        <Menu.Item key="tesk-list">任务列表</Menu.Item>
        <Menu.SubMenu key="SubMenu" title="规则配置">
          <Menu.Item key="quality-scoring-rules">质量分规则</Menu.Item>
          <Menu.Item key="global-control-point-rules">全局卡点规则</Menu.Item>
          <Menu.Item key="app-control-point-rules">应用卡点规则</Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </FilterCard>
  );
}
