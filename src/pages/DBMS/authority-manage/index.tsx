
import React, { useState,useEffect} from 'react';
import {  Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { history } from 'umi';
import AuthorityApply from '../authority-manage/components/authority-apply';
import MyAuthority from '../authority-manage/components/my-authority';
import VCPermission from '@/components/vc-permission';
import './index.less'
const { TabPane } = Tabs;
export default function AuthorityManage(){
    const [tabKey, setTabKey] = useState<any>('authority-apply');
    useEffect(()=>{
      history.push({
        pathname:  `/matrix/DBMS/authority-manage/authority-apply`,
        
      });
    },[])
    

    return(<PageContainer className="authority-manage-page">
         <Tabs
        activeKey={tabKey}
        onChange={(val) => {
          setTabKey(val);
         
          history.push({
            pathname:  `/matrix/DBMS/authority-manage/${val}`,
            
          });
        }}
      >
        <TabPane tab="权限申请" key="authority-apply">
        <VCPermission code={window.location.pathname} isShowErrorPage >
        <AuthorityApply/>

        </VCPermission>
        
        </TabPane>
        <TabPane tab="我的权限" key="my-authority">
        <VCPermission code={window.location.pathname} isShowErrorPage>
        <MyAuthority/>

        </VCPermission>
       
        </TabPane>
      </Tabs>

    </PageContainer>)
}