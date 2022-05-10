import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Button, Table, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import './index.less';
import { deleteRegion, getRegionList } from '../service';
import CreateRegionDrawer from './component/create-region-drawer';
import { useEnvOptions } from '../hooks';
import DomainConfig from './component/domain-config';
import NoiseReduction from './component/noise-reduction';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

export default function DomainConfigs() {
  const [activeTab, setActiveTab] = useState<string>('domain');
  const tabConfig = [
    { label: '配置域', key: 'domain' },
    { label: '降噪处理', key: 'noise' },
  ];

  return (
    <PageContainer className="domain-config">
      {/* <FilterCard> */}
      <Tabs
        defaultActiveKey="domain"
        onChange={(v) => {
          setActiveTab(v);
        }}
        type="card"
      >
        {tabConfig.map((item) => {
          return <TabPane tab={item.label} key={item.key}></TabPane>;
        })}
      </Tabs>
      {/* </FilterCard> */}
      <ContentCard>{activeTab === 'domain' ? <DomainConfig /> : <NoiseReduction />}</ContentCard>
    </PageContainer>
  );
}
