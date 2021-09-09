import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Select } from 'antd';
import LineChart from './line-chart';
import RankList from './rank-list';
import './index.less';

export default function Overview(props: any) {
  const [appSevices, setAppSevices] = useState<any[]>([]);

  return (
    <PageContainer className="quality-control-overview">
      <HeaderTabs activeKey="overview" history={props.history} />
      <ContentCard>
        <label>
          应用服务: <Select allowClear placeholder="Please select" />
        </label>
        <div className="line-chart-group">
          {[1, 2, 3, 4, 5, 6].map(() => (
            <LineChart />
          ))}
        </div>
        <div className="rank-list-group">
          {[1, 2, 3, 4, 5, 6].map(() => (
            <RankList />
          ))}
        </div>
      </ContentCard>
    </PageContainer>
  );
}
