
import React, { useState, useEffect } from 'react';
import { Tabs, Select } from 'antd';
import PageContainer from '@/components/page-container';
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';
import { parse, stringify } from 'query-string';
import {history, useLocation,Outlet } from 'umi';

import './index.less'
const { TabPane } = Tabs;

export default function AuthorityManage() {
  let location = useLocation();
  const query = parse(location.search);
  const initInfo: any = location.state || {};
  const [tabKey, setTabKey] = useState<any>('plan');
  const [envOptions, setEnvOptions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [curEnvCode, setCurEnvCode] = useState<string>('')
  


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
        tabBarExtraContent={
          <div style={{ display: 'flex', height: 24, alignItems: "center", }}>
          <b>选择环境：</b> <Select style={{ width: 210 }} value={curEnvCode} showSearch  loading={loading} options={envOptions} onChange={(value: string) => {
            setCurEnvCode(value)
          }} />
        </div>
        }
      >
        <TabPane tab="备份计划" key="plan">
          
        </TabPane>
        <TabPane tab="备份记录" key="record">
         
        </TabPane>
      </Tabs>
      <VCPermission code={window.location.pathname} isShowErrorPage>
        {/* {props.children} */}
        <Outlet/>
      </VCPermission>
    </div>
    </ContentCard>
    {/* </ContentCard> */}
  </PageContainer>)
}