
import React, { useState,useEffect} from 'react';
import { Tabs} from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard} from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';
import {history,Outlet } from 'umi';
import './index.less'
const { TabPane } = Tabs;
export default function AuthorityManage() {
  const [tabKey, setTabKey] = useState<any>('plan');
  useEffect(()=>{
    history.push("/matrix/database/backup/plan")
  },[])
  
  return (<PageContainer className="nacos-config-wrap">
    <ContentCard>
    <div className="nacos-manage-page">
      <Tabs
        activeKey={tabKey}
        onChange={(val) => {
          setTabKey(val);
          history.push({
            pathname: `/matrix/database/backup/${val}`,

          });
        }}
      
      >
        <TabPane tab="备份计划" key="plan"> 
        </TabPane>
        <TabPane tab="备份记录" key="record">
        </TabPane>
      </Tabs>
      <VCPermission code={window.location.pathname} isShowErrorPage>
        <Outlet/>
      </VCPermission>
    </div>
    </ContentCard>
  </PageContainer>)
}