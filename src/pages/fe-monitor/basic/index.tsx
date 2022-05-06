import React, { useState } from 'react';
import { Select, Tabs } from 'antd';
import { history } from 'umi';
import BasicOverview from './components/overview';
import BasicError from './components/error';
import BasicPerformance from './components/performance';
import BasicApi from './components/api';
import { menuList } from './const';
import './index.less';

const { TabPane } = Tabs;

const BasicFeMonitor = () => {
  const [activeKey, setActiveKey] = useState<any>(history?.location?.query?.appGroup || '');
  const [tabKey, setTabKey] = useState<any>(history?.location?.query?.tab || '1');

  return (
    <div className="basic-fe-monitor-wrapper">
      <div className="app-group-tab-wrapper">
        <Select
          value={activeKey}
          showSearch
          filterOption={(input, option) => {
            // @ts-ignore
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
          style={{ width: '200px' }}
          onChange={(val) => {
            setActiveKey(val);
            history.replace({
              pathname: '/matrix/monitor/fe-monitor',
              query: {
                appGroup: val,
                tab: tabKey,
              },
            });
          }}
        >
          {menuList.map((item) => (
            <Select.Option value={item.key} key={item.key}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="app-group-content-wrapper">
        <Tabs
          activeKey={tabKey}
          onChange={(val) => {
            setTabKey(val);
            history.replace({
              pathname: '/matrix/monitor/fe-monitor',
              query: {
                appGroup: activeKey,
                tab: val,
              },
            });
          }}
        >
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
