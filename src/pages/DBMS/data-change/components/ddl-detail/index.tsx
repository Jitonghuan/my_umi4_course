import React, { useState, useEffect } from 'react';
import { Tabs, Select } from 'antd';
import PageContainer from '@/components/page-container';
import { history, useLocation } from 'umi';
import DetailContext from './context'
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';
import ContentDetail from './content-detail';
import DevDetail from './dev-detail'
import { parse, stringify } from 'query-string';
import './index.less'
export default function DDLDetail(){
    const [tabKey, setTabKey] = useState<any>('dev');
    return(
        <PageContainer>
             <Tabs
        activeKey={tabKey}

        onChange={(val) => {
          setTabKey(val);

        
        }}


      >
        <Tabs.TabPane tab="DEV" key="dev" />
        <Tabs.TabPane tab="TEST" key="test" />
        <Tabs.TabPane tab="PRE" key="pre" />
        <Tabs.TabPane tab="PROD" key="prod" />
      </Tabs>
      {tabKey==="dev"&&<DevDetail/>}
      {tabKey!=="dev"&&  <ContentDetail/>}
    

    </PageContainer>
    )
}