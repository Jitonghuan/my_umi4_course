import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Button, Table, Popconfirm } from 'antd';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import './index.less';
import DomainConfig from './component/domain-config';
import NoiseReduction from './component/noise-reduction';
import { Tabs } from 'antd';
import { history } from 'umi'

const { TabPane } = Tabs;

export default function DomainConfigs() {
  const [activeTab, setActiveTab] = useState<string>('domain-config');
  const tabConfig = [
    { label: '域配置', key: 'domain-config' },
    { label: '降噪配置', key: 'noise-reduction' },
  ];

  if (history?.location?.pathname === '/matrix/trafficmap/config') {
    return (
      history.replace({
        pathname: `${location?.pathname}/domain-config`,
        // query: { ...location.query },
      }),
      null
    );
  }

  return (
    <PageContainer className="domain-config">
      <FilterCard className='layout-compact'>
        <Tabs
          defaultActiveKey="domain-config"
          onChange={(v) => {
            setActiveTab(v);
            history.push(`/matrix/trafficmap/config/${v}`)
          }}
        >
          {tabConfig.map((item) => {
            return <TabPane tab={item.label} key={item.key}></TabPane>;
          })}
        </Tabs>
      </FilterCard>
      <ContentCard>{activeTab === 'domain-config' ? <DomainConfig /> : <NoiseReduction />}</ContentCard>
    </PageContainer>
  );
}
