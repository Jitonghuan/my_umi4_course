// 应用卡片列表
// @author CAIHUAZHI <moyan@come-future.com>
// @create 2021/08/25 09:26

import React, { useState } from 'react';
import { Select, Tabs } from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import BoardCardList from './component/board-card';
import DataSource from './component/datasource';
import './index.less';

const rootCls = 'monitor-board';

export default function Board() {

  const [activeKey, setActiveKey] = useState<string>('board')

  return (
    <PageContainer className={rootCls}>
      <div className="app-group-tab-wrapper">
        <div className="env-select-wrapper">
          <span>集群选择：</span>
          <Select
            clearIcon={false}
            style={{ width: '120px' }}
            options={[

            ]}
            onChange={()=>{}} />
        </div>
      </div>
      <div className="app-group-content-wrapper">
        <Tabs
          activeKey={activeKey}
          onChange={(val) => {
            setActiveKey(val);
          }}
        >
          <Tabs.TabPane tab="监控大盘" key="board" />
          <Tabs.TabPane tab="数据源" key="datasource" />
        </Tabs>
        {/* <div className="app-group-content"> */}
          {activeKey === "board" &&
            <BoardCardList />
          }
          {activeKey === "datasource" &&
            <DataSource />
          }
        {/* </div> */}
      </div>
    </PageContainer>
  );
}
