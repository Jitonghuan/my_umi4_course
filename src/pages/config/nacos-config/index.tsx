
import React, { useState,useEffect} from 'react';
import {  Tabs,Select } from 'antd';
import PageContainer from '@/components/page-container';
import { history ,useLocation} from 'umi';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import NacosPage from './components/nacos';
import NamespacePage  from './components/namespace'

import VCPermission from '@/components/vc-permission';
import { parse ,stringify} from 'query-string';
import './index.less'
const { TabPane } = Tabs;

export default function AuthorityManage(){
    let location = useLocation();
    const query = parse(location.search);
    const initInfo: any = location.state || {};
    const [tabKey, setTabKey] = useState<any>('nacos');
    // useEffect(()=>{
    // history.push({
    //       pathname:  `/matrix/config/nacos-config/nacos`,        
    //     });
    // },[])
    

    return(<PageContainer>
      {/* <ContentCard noPadding className="nacos-manage-page"> */}
      <FilterCard className="nacos-config-filter">
            <div style={{ display: 'flex', height: 24, alignItems: "center", }}>
                <b>选择环境：</b> <Select style={{ width: 210 }} />
            </div>


        </FilterCard>
      <div className="nacos-manage-page">
         <Tabs
        activeKey={tabKey}
        onChange={(val) => {
          setTabKey(val);
         
          history.push({
            pathname:  `/matrix/config/nacos-config/${val}`,
            
          });
        }}
      >
        <TabPane tab="nacos配置" key="nacos">
        <VCPermission code={window.location.pathname} isShowErrorPage >
        <NacosPage/>

        </VCPermission>
        
        </TabPane>
        <TabPane tab="命名空间" key="namespace">
        <VCPermission code={window.location.pathname} isShowErrorPage>
       <NamespacePage/>

        </VCPermission>
       
        </TabPane>
      </Tabs>
      </div>
      {/* </ContentCard> */}
    </PageContainer>)
}