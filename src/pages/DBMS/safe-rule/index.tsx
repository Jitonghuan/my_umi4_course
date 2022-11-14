
import React, { useState, useEffect } from 'react';
import { Tabs, Select } from 'antd';
import PageContainer from '@/components/page-container';
import { history, useLocation } from 'umi';
import DetailContext from './context'
import InstanceList from '../safe-rule/components/instance-list';
import SafeList from '../safe-rule/components/safe-list'
import { ContentCard, FilterCard } from '@/components/vc-page-content';
import VCPermission from '@/components/vc-permission';
import { parse, stringify } from 'query-string';
import './index.less'
const { TabPane } = Tabs;

export default function AuthorityManage() {
  let location = useLocation();
  const query = parse(location.search);
  const initInfo: any = location.state || {};
  const [tabKey, setTabKey] = useState<any>('safe-list');
  const [envOptions, setEnvOptions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [curEnvCode, setCurEnvCode] = useState<string>('')


  return (<PageContainer className="safe-rule-wrap">
    <div className="safe-rule-content-wrapper">
      <Tabs
        activeKey={tabKey}

        onChange={(val) => {
          setTabKey(val);

          history.push({
            pathname: `/matrix/DBMS/safe-rule/${val}`,

          });
        }}


      >
        <Tabs.TabPane tab="安全规则" key="safe-list" />
        <Tabs.TabPane tab="实例规则" key="instance-list" />
      </Tabs>

      {/* </FilterCard> */}
      {/* <ContentCard> */}
      {tabKey === "safe-list" && (
        <DetailContext.Provider value={{ envCode: curEnvCode, tabKey: tabKey }}>
          <VCPermission code={window.location.pathname} isShowErrorPage >
            <SafeList />
          </VCPermission>
        </DetailContext.Provider>

      )}
      {tabKey === "instance-list" && (

        <DetailContext.Provider value={{ envCode: curEnvCode, tabKey: tabKey }}>
          <VCPermission code={window.location.pathname} isShowErrorPage>
            <InstanceList />
          </VCPermission>
        </DetailContext.Provider>

      )}



    </div>


  </PageContainer>)
}