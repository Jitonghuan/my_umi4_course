import React, { useState } from 'react';
import { Tabs } from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import BoardCardList from './component/board-card';
import DataSource from './component/datasource';
import Panel from './component/panel';
import './index.less';

const rootCls = 'monitor-board';

export default function Board() {

  const [activeKey, setActiveKey] = useState<string>('board')

  return (
    <PageContainer className={rootCls}>
      <div className="app-group-content-wrapper">
        <Tabs
          activeKey={activeKey}
          onChange={(val) => {
            setActiveKey(val);
          }}
        >
          <Tabs.TabPane tab="监控列表" key="board" />
          <Tabs.TabPane tab="大盘模版" key="panel" />
          <Tabs.TabPane tab="数据源" key="datasource" />
        </Tabs>
        {activeKey === "board" &&
          <BoardCardList />
        }
        {activeKey === "panel" &&
          <Panel />
        }
        {activeKey === "datasource" &&
          <DataSource />
        }
      </div>
    </PageContainer>
  );
}
