import React, { useState,} from 'react';
import { FilterCard, ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import './index.less';
import DomainConfig from './component/domain-config';
import NoiseReduction from './component/noise-reduction';
import { Tabs } from 'antd';
import { history,useLocation } from 'umi';
import { parse } from 'query-string';

const { TabPane } = Tabs;

export default function DomainConfigs() {
  let location:any = useLocation();
  const query:any = parse(location.search);
  const [activeTab, setActiveTab] = useState<string>('domain-config');
  const tabConfig = [
    { label: '域配置', key: 'domain-config' },
    { label: '降噪配置', key: 'noise-reduction' },
  ];

  if (location?.pathname === '/matrix/trafficmap/config') {
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
