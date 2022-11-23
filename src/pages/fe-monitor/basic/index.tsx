import React, { useEffect, useState } from 'react';
import { Select, Tabs } from 'antd';
import { history,useLocation } from 'umi';
import BasicOverview from './components/overview';
import BasicError from './components/error';
import BasicPerformance from './components/performance';
import BasicApi from './components/api';
import { getCommonEnvCode } from './server';
import { parse } from 'query-string';
import { envList, menuList } from './const';
import './index.less';
import appConfig from '@/app.config';
import Header from './components/header';
import { now } from './const';

const { TabPane } = Tabs;

let defaultEnvCode = appConfig.BUILD_ENV === 'prod' ? 'hbos-test' : 'g3a-test';
defaultEnvCode = appConfig.IS_Matrix === 'public' ? defaultEnvCode : '';

// @ts-ignore
const envType = window.matrixConfigData.curEnvType || appConfig.envType;

const ENV_LIST = envList[envType] || envList.default;

const BasicFeMonitor = () => {
  let location:any = useLocation();
  const query :any= parse(location.search);
  const [activeKey, setActiveKey] = useState<any>(query?.appGroup || '');
  const [feEnv, setFeEnv] = useState<string>(ENV_LIST[1].key || '*');
  const [tabKey, setTabKey] = useState<any>(query?.tab || '1');
  const [envCode, setEnvCode] = useState(defaultEnvCode);
  const [timeList, setTimeList] = useState<any>(now);

  useEffect(() => {
    if (appConfig.IS_Matrix !== 'public') {
      getCommonEnvCode({}).then((res) => {
        if (res.success && res.data) {
          setEnvCode(res.data);
        }
      });
    }
  }, []);

  const renderActiveCon = () => {
    const param = {
      feEnv,
      envCode,
      appGroup: activeKey,
    };
    if (!envCode) {
      return;
    }
    switch (tabKey) {
      case '1':
        return <BasicOverview {...param} timeList={timeList} />;
      case '2':
        return <BasicError {...param} timeList={timeList} />;
      case '3':
        return <BasicPerformance {...param} timeList={timeList} />;
      case '4':
        return <BasicApi {...param} timeList={timeList} />;
    }
  };

  return (
    <div className="basic-fe-monitor-wrapper">
      <div className="app-group-tab-wrapper">
        {appConfig.IS_Matrix === 'public' || envType === 'fygs'  ? (
          <div className="env-select-wrapper">
            <span>域名：</span>
            <Select value={feEnv} clearIcon={false} style={{ width: '120px' }} onChange={setFeEnv}>
              {ENV_LIST.map((item: any) => (
                <Select.Option value={item.key} key={item.key}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        ) : null}
        <Select
          value={activeKey}
          showSearch
          filterOption={(input, option) => {
            // @ts-ignore
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
          style={{ width: '200px', marginLeft: '10px' }}
          onChange={(val) => {
            setActiveKey(val);
            history.replace({
              pathname: '/matrix/monitor/fe-monitor',
              search:`appGroup=${val}&tab=${tabKey}`
              // query: {
              //   appGroup: val,
              //   tab: tabKey,
              // },
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
              search:`appGroup=${activeKey}&tab=${val}`
              // query: {
              //   appGroup: activeKey,
              //   tab: val,
              // },
            });
          }}
        >
          <TabPane tab="数据总览" key="1" />
          <TabPane tab="错误分析" key="2" />
          <TabPane tab="性能分析" key="3" />
          <TabPane tab="API分析" key="4" />
        </Tabs>
        <div className="app-group-content">
          <Header defaultTime={timeList} onChange={setTimeList} />
          {renderActiveCon()}
        </div>
      </div>
    </div>
  );
};

export default BasicFeMonitor;
