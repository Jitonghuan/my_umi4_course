import React, { useMemo, useState,} from 'react';
import {Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard } from '@/components/vc-page-content';
import LogConfig from './log-config';
import LowSqlDetail from './lowSql-detail';
import LowSqlStatistics from './lowSql-statistics';
export default function SessionDiag(){
    const { TabPane } = Tabs;
    const [activeKey,setActiveKey]=useState<string>("statistics")
    const filteredTabList = useMemo(() => {
      return[
        {key:"statistics",tab:"慢日志统计",component:<LowSqlStatistics/>},
        {key:"detail",tab:"慢日志明细",component:<LowSqlDetail/>},
        {key:"config",tab:"日志配置",component: <LogConfig/>},
       
      ]
    },[])
    return (
      <PageContainer>
           <ContentCard>
        <Tabs activeKey={activeKey} onChange={(key)=>{setActiveKey(key)}} >
           {filteredTabList.map((element) => (
            <TabPane tab={element.tab} key={element.key}>
              {element?.component}
            </TabPane>
          ))}  
        </Tabs>  
        </ContentCard>
      </PageContainer>
     
    )
}