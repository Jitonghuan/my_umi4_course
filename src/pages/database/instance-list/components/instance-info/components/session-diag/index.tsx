import React, { useMemo, useEffect, useState,useContext } from 'react';
import PageContainer from '@/components/page-container';
import { Empty, Segmented,Tabs } from 'antd';
import {history, useLocation,Outlet } from 'umi';
import { ContentCard } from '@/components/vc-page-content';
import SessionManage from './manage';
import LockPage from './lock'
import  DetailContext  from '../../context'
export default function SessionDiag(){
    const {clusterId,clusterRole,instanceId} =useContext(DetailContext);
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