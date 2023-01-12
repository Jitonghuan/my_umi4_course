
import React, { useState, useEffect } from 'react';
import { Tabs, Select } from 'antd';
import PageContainer from '@/components/page-container';
import { history, useLocation } from 'umi';
import InstanceList from '../safe-rule/components/instance-list';
import SafeList from '../safe-rule/components/safe-list'
import VCPermission from '@/components/vc-permission';
import './index.less'


export default function AuthorityManage() {
  const [tabKey, setTabKey] = useState<any>('safe-list');
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
      {tabKey === "safe-list" && (
          <VCPermission code={window.location.pathname} isShowErrorPage >
            <SafeList />
          </VCPermission>
      )}
      {tabKey === "instance-list" && (
          <VCPermission code={window.location.pathname} isShowErrorPage>
            <InstanceList />
          </VCPermission>
      )}
    </div>


  </PageContainer>)
}