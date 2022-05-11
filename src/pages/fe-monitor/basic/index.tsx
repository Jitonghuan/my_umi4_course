import React, { useEffect, useMemo, useState } from 'react';
import { Select, Tabs } from 'antd';
import { history } from 'umi';
import BasicOverview from './components/overview';
import BasicError from './components/error';
import BasicPerformance from './components/performance';
import BasicApi from './components/api';
import { getCommonEnvCode } from './server';
import { envList, menuList } from './const';
import './index.less';
import appConfig from '@/app.config';

const { TabPane } = Tabs;

let defaultEnvCode = appConfig.BUILD_ENV === 'prod' ? 'hbos-test' : 'g3a-test';
defaultEnvCode = appConfig.IS_Matrix === 'public' ? defaultEnvCode : '';

const BasicFeMonitor = () => {
  const [activeKey, setActiveKey] = useState<any>(history?.location?.query?.appGroup || '1');
  const [feEnv, setFeEnv] = useState<string>('*');
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

  const renderActiveCon = useMemo(() => {
    const param = {
      feEnv,
      envCode,
      appGroup: activeKey,
    };
    if (!envCode) {
      return;
    }
    switch (activeKey) {
      case '1':
        return <BasicOverview {...param} />;
      case '2':
        return <BasicError {...param} />;
      case '3':
        return <BasicPerformance {...param} />;
      case '4':
        return <BasicApi {...param} />;
    }
  }, [activeKey, envCode, feEnv]);

  return (
    <div className="basic-fe-monitor-wrapper">
      <div className="app-group-tab-wrapper">
        {appConfig.IS_Matrix === 'public' && (
          <div className="env-select-wrapper">
            <span>域名：</span>
            <Select value={feEnv} clearIcon={false} style={{ width: '120px' }} onChange={setFeEnv}>
              {envList.map((item) => (
                <Select.Option value={item.key} key={item.key}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
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
          <TabPane tab="数据总览" key="1" />
          <TabPane tab="错误分析" key="2" />
          <TabPane tab="性能分析" key="3" />
          <TabPane tab="API分析" key="4" />
        </Tabs>
        <div className="app-group-content">{}</div>
      </div>
    </div>
  );
};

export default BasicFeMonitor;
