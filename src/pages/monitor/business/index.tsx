import React, {useState} from 'react';
import { history } from 'umi';
import { Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import './index.less';
import DpMonitor from './dp-monitor';
import PrometheusCom from './prometheus';

const { TabPane } = Tabs;

export default function Dashboard() {
  const [tabKey, setTabKey] = useState<any>(history?.location?.query?.tab || '1');

  return (
    <PageContainer className="monitor-business-wrapper">
      <Tabs
        activeKey={tabKey}
        onChange={(val) => {
          setTabKey(val);
          history.replace({
            pathname: '/matrix/monitor/business',
            query: {
              tab: val,
            },
          });
        }}
      >
        <TabPane tab="数据库接入" key="1">
          <DpMonitor />
        </TabPane>
        <TabPane tab="应用接入" key="3">
          <PrometheusCom/>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
}
