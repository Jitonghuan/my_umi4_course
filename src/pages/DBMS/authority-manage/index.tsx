
import React, { useState,useEffect} from 'react';
import {  Tabs } from 'antd';
import PageContainer from '@/components/page-container';
import { history ,useLocation} from 'umi';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import AuthorityApply from '../authority-manage/components/authority-apply';
import MyAuthority from '../authority-manage/components/my-authority';
import VCPermission from '@/components/vc-permission';
import { parse ,stringify} from 'query-string';
import './index.less'
const { TabPane } = Tabs;
export default function AuthorityManage(){
    let location = useLocation();
    const query = parse(location.search);
    const initInfo: any = location.state || {};
    const [tabKey, setTabKey] = useState<any>('authority-apply');
    useEffect(()=>{
      if(query?.detail==="true"&&query?.id){
        const info={...query}
        history.push({
          pathname:  `/matrix/DBMS/authority-manage/authority-apply`,
          search:  stringify(info),
          
        });

      }else if(initInfo?.applyDetail){
        history.push({
          pathname:  `/matrix/DBMS/authority-manage/authority-apply`,
          
        },{
          applyDetail:true,
          noPowerData:{
                                            ...initInfo?.noPowerData
                          }

        });

      }else{
        history.push({
          pathname:  `/matrix/DBMS/authority-manage/authority-apply`,
          
        });
      }
      

      
    },[])
    

    return(<PageContainer    >
      <ContentCard  className="authority-manage-page">
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
      </ContentCard>
    </PageContainer>)
}