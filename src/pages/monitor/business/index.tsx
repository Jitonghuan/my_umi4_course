import React, {useState} from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import './index.less';
import DpMonitor from './dp-monitor';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';
import PrometheusCom from './prometheus';


const { TabPane } = Tabs;

export default function Dashboard() {
  let location:any = useLocation();
  const query :any= parse(location.search);
  const [tabKey, setTabKey] = useState<any>(query?.tab || 'db');

  return (
    <PageContainer className="monitor-business-wrapper">
      <Tabs
        activeKey={tabKey}
        onChange={(val) => {
          setTabKey(val);
          history.replace({
            pathname: '/matrix/monitor/business',
            search:`tab=${val}`
            // query: {
            //   tab: val,
            // },
          });
        }}
      >
        <TabPane tab="数据库接入" key="db">
          <DpMonitor  />
        </TabPane>
        <TabPane tab="应用接入" key="interface">
          <PrometheusCom/>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
}
