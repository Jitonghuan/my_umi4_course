import React, { useEffect, useState } from 'react';
import { Select, Tabs } from 'antd';
import { history } from 'umi';
import BasicOverview from './components/overview';
import BasicError from './components/error';
import BasicPerformance from './components/performance';
import BasicApi from './components/api';
import { getCommonEnvCode } from './server';
import { menuList } from './const';
import './index.less';
import appConfig from '@/app.config';

const { TabPane } = Tabs;

let defaultEnvCode = appConfig.BUILD_ENV === 'prod' ? 'hbos-test' : 'g3a-test';
defaultEnvCode = appConfig.IS_Matrix === 'public' ? defaultEnvCode : '';

const BasicFeMonitor = () => {
  const [activeKey, setActiveKey] = useState<any>(history?.location?.query?.appGroup || '');
  const [tabKey, setTabKey] = useState<any>(history?.location?.query?.tab || '1');
  const [envCode, setEnvCode] = useState(defaultEnvCode);

  useEffect(() => {
    if (appConfig.IS_Matrix !== 'public') {
      getCommonEnvCode({}).then((res) => {
        if (res.success && res.data) {
          setEnvCode(res.data);
        }
      });
    }
  }, []);

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
            {envCode && <BasicOverview appGroup={activeKey} envCode={envCode} />}
          </TabPane>
          <TabPane tab="错误分析" key="2">
            {envCode && <BasicError appGroup={activeKey} envCode={envCode} />}
          </TabPane>
          <TabPane tab="性能分析" key="3">
            {envCode && <BasicPerformance appGroup={activeKey} envCode={envCode} />}
          </TabPane>
          <TabPane tab="API分析" key="4">
            {envCode && <BasicApi appGroup={activeKey} envCode={envCode} />}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default BasicFeMonitor;
