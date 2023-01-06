import React, { useMemo, useState,} from 'react';
import PageContainer from '@/components/page-container';
import {Tabs } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import SessionManage from './manage';
import LockPage from './lock'
export default function SessionDiag(){
    const { TabPane } = Tabs;
    const [activeKey,setActiveKey]=useState<string>("manage")
    const filteredTabList = useMemo(() => {
      return[
        {key:"manage",tab:"会话管理",component:<SessionManage/>},
        {key:"lock",tab:"锁分析",component:<LockPage/>}
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