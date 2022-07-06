import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { ContentCard } from '@/components/vc-page-content';
import DeployContent from './deploy-content';
import HotFix from './deploy-content/components/hot-fix';
import { history } from 'umi';
import './index.less';

const { TabPane } = Tabs;

const envTypeData = [
  {
    label: 'DEV',
    value: 'dev'
  },
  {
    label: 'TEST',
    value: 'test'
  },
  {
    label: 'PRE',
    value: 'pre'
  },
  {
    label: 'PROD',
    value: 'latest'
  }
];

export default function Deploy(props: any) {
  const [tabActive, setTabActive] = useState(
    props.location.query.activeTab || 'dev',
  );

  useEffect(() => {
    history.push({ query: { ...props.location.query, activeTab: tabActive } });
  }, [tabActive]);

  // tab页切换
  const handleTabChange = (v: string) => {
    setTabActive(v);
  };

  return (
    <ContentCard noPadding>

      <Tabs
        onChange={(v) => {
          handleTabChange(v);
        }}
        activeKey={tabActive}
        type="card"
      >
        {envTypeData?.map((item) => (
          <TabPane tab={item.label} key={item.value}>
            <DeployContent
              isActive={item.value === tabActive}
              envTypeCode={item.value}
              envList={envTypeData}
            />
          </TabPane>
        ))}
        <TabPane tab="HOTFIX" key='hotFix'>
          <HotFix />
        </TabPane>
      </Tabs>
    </ContentCard>
  );
}
