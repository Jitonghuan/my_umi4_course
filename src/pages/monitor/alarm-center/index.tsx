import React, { useState } from 'react';
import { Tabs } from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import CurrentAlarm from '../current-alarm/index';
import AlarmRules from '../alarm-rules/index';
import AlarmHistory from '../history/index';
import AlarmGroup from '../alarm-group';
import './index.less';
import { history, useLocation } from 'umi';
import { parse } from 'query-string';

const rootCls = 'alarm-center';

export default function Board() {
  let location: any = useLocation();
  const query: any = parse(location.search);
  const [activeKey, setActiveKey] = useState<string>(query?.tab || 'current');

  return (
    <PageContainer className={rootCls}>
      <div className="app-group-content-wrapper">
        <Tabs
          activeKey={activeKey}
          onChange={(val) => {
            setActiveKey(val);
            history.replace({
              pathname: '/matrix/monitor/alarm-rules',
              search: `tab=${val}`,
            });
          }}
        >
          <Tabs.TabPane tab="当前报警" key="current" />
          <Tabs.TabPane tab="报警规则" key="rules" />
          <Tabs.TabPane tab="报警历史" key="history" />
          <Tabs.TabPane tab="报警分组" key="group" />
        </Tabs>
        {activeKey === 'current' && <CurrentAlarm />}
        {activeKey === 'rules' && <AlarmRules />}
        {activeKey === 'history' && <AlarmHistory />}
        {activeKey === 'group' && <AlarmGroup />}
      </div>
    </PageContainer>
  );
}
