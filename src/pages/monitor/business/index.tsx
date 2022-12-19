import React, {useState,useEffect} from 'react';
import { Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import './index.less';
import DpMonitor from './dp-monitor';
import { history,useLocation } from 'umi';
import { parse,stringify } from 'query-string';
import PrometheusCom from './prometheus';
import LogPrometheus from './log-prometheus/index';


const { TabPane } = Tabs;

export default function Dashboard() {
  let location:any = useLocation();
  const query :any= parse(location.search);
  const [tabKey, setTabKey] = useState<any>(query?.tab || 'db');
  useEffect(()=>{
    if(query?.tab){
      const queryInfo={...query}
      history.replace({
        pathname: '/matrix/monitor/business',
        search:stringify(queryInfo)
      });

      
    }else{
      history.replace({
        pathname: '/matrix/monitor/business',
        search:`tab=db`
      });

    }

  },[])
  

  return (
    <PageContainer className="monitor-business-wrapper">
      <Tabs
        activeKey={tabKey}
        onChange={(val) => {
          setTabKey(val);
          history.replace({
            pathname: '/matrix/monitor/business',
            search:`tab=${val}`
          });
        }}
      >
        <TabPane tab="数据级接入" key="db">
          <DpMonitor  tab={query?.tab}  queryMonitorName= {query?.monitorName} />
        </TabPane>
        <TabPane tab="API级接入" key="interface">
          <PrometheusCom  tab={query?.tab}  queryMonitorName= {query?.monitorName}/>
        </TabPane>
        <TabPane tab="日志级接入" key="log">
          <LogPrometheus/>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
}
