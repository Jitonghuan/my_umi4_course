import React, { useState } from 'react';
import { Tabs } from '@cffe/h2o-design';
import PageContainer from '@/components/page-container';
import CurrentAlarm from '../current-alarm/index';
import AlarmRules from '../alarm-rules/index';
import AlarmHistory from '../history/index';
import AlarmTemplate from '../template/index';
import './index.less';

const rootCls = 'alarm-center';

export default function Board() {

  const [activeKey, setActiveKey] = useState<string>('current')

  return (
    <PageContainer className={rootCls}>
      <div className="app-group-content-wrapper">
        <Tabs
          activeKey={activeKey}
          onChange={(val) => {
            setActiveKey(val);
          }}
        >
          <Tabs.TabPane tab="当前报警" key="current" />
          <Tabs.TabPane tab="报警规则" key="rules" />
          <Tabs.TabPane tab="报警历史" key="history" />
          <Tabs.TabPane tab="报警模版" key="template" />
        </Tabs>
        {activeKey === "current" &&
          <CurrentAlarm />
        }
        {activeKey === "rules" &&
          <AlarmRules />
        }
        {activeKey === "history" &&
        <AlarmHistory />
        }
        {activeKey === "template" &&
          <AlarmTemplate />
        }
      </div>
    </PageContainer>
  );
}
