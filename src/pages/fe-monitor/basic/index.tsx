import React from 'react';
import { Tabs } from 'antd';
import BasicOverview from './components/overview';
import BasicError from './components/error';
import BasicPerformance from './components/performance';
import BasicApi from './components/api';
import './index.less';

const { TabPane } = Tabs;

const BasicFeMonitor = () => {
  return (
    <div className="basic-fe-monitor-wrapper">
      <Tabs defaultActiveKey="3">
        <TabPane tab="数据总览" key="1">
          <BasicOverview />
        </TabPane>
        <TabPane tab="错误分析" key="2">
          <BasicError />
        </TabPane>
        <TabPane tab="性能分析" key="3">
          <BasicPerformance />
        </TabPane>
        <TabPane tab="API分析" key="4">
          <BasicApi />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BasicFeMonitor;
