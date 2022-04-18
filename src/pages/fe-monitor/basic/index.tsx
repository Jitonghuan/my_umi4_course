import React, { useState } from 'react';
import { Tabs } from 'antd';
import { history } from 'umi';
import BasicOverview from './components/overview';
import BasicError from './components/error';
import BasicPerformance from './components/performance';
import BasicApi from './components/api';
import './index.less';

const { TabPane } = Tabs;
const menuList = [
  {
    name: '总览',
    key: '',
  },
  {
    name: '医生端',
    key: 'doctor',
  },
  {
    name: '收费端',
    key: 'charge',
  },
];
const BasicFeMonitor = () => {
  const [activeKey, setActiveKey] = useState<any>(history?.location?.query?.appGroup || '');

  return (
    <div className="basic-fe-monitor-wrapper">
      <div className="app-group-tab-wrapper">
        <Tabs
          tabPosition="left"
          activeKey={activeKey}
          onChange={(val) => {
            setActiveKey(val);
            history.replace({
              pathname: '/matrix/monitor/fe-monitor',
              query: {
                appGroup: val,
              },
            });
          }}
        >
          {menuList.map((item) => (
            <TabPane tab={item.name} key={item.key}>
              {' '}
            </TabPane>
          ))}
        </Tabs>
      </div>
      <div className="app-group-content-wrapper">
        <Tabs defaultActiveKey="3">
          <TabPane tab="数据总览" key="1">
            <BasicOverview appGroup={activeKey} />
          </TabPane>
          <TabPane tab="错误分析" key="2">
            <BasicError appGroup={activeKey} />
          </TabPane>
          <TabPane tab="性能分析" key="3">
            <BasicPerformance appGroup={activeKey} />
          </TabPane>
          <TabPane tab="API分析" key="4">
            <BasicApi appGroup={activeKey} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default BasicFeMonitor;
