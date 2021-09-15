import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Select } from 'antd';
import { getRanking } from '../service';
import { getRequest } from '@/utils/request';
import LineChart from './line-chart';
import RankList from './rank-list';
import './index.less';

const rankListData = [
  {
    leftLabel: '质量分最优Top10',
    leftDataPropName: 'qualityPointsGoodTop10',
    rightLabel: '质量分最差Top10',
    rightDataPropName: 'qualityPointsBadTop10',
  },
  {
    leftLabel: '单测通过率最优Top10',
    leftDataPropName: 'utPassRateGoodTop10',
    rightLabel: '单测通过率最差Top10',
    rightDataPropName: 'utPassRateBadTop10',
  },
  {
    leftLabel: '代码问题总数量最少Top10',
    leftDataPropName: 'codeBugsGoodTop10',
    rightLabel: '代码问题总数量最多Top10',
    rightDataPropName: 'codeBugsBadTop10',
  },
  {
    leftLabel: '单测覆盖率最优Top10',
    leftDataPropName: 'utCovRateGoodTop10',
    rightLabel: '单测覆盖率最差Top10',
    rightDataPropName: 'utCovRateBadTop10',
  },
];

export default function Overview(props: any) {
  const [appSevices, setAppSevices] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any>();

  useEffect(() => {
    getRequest(getRanking).then((res) => {
      setRanking(res.data);
      console.log('res.data :>> ', res.data);
    });
  }, []);

  return (
    <PageContainer className="quality-control-overview">
      <HeaderTabs activeKey="overview" history={props.history} />
      <ContentCard>
        <label>
          应用服务: <Select allowClear placeholder="Please select" />
        </label>
        <div className="line-chart-group">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <LineChart key={index} />
          ))}
        </div>
        <div className="rank-list-group">
          {rankListData.map((item, index) => (
            <RankList
              key={index}
              leftLabel={item.leftLabel}
              leftDataSource={ranking?.[item.leftDataPropName]}
              rightLabel={item.rightLabel}
              rightDataSource={ranking?.[item.rightDataPropName]}
            />
          ))}
        </div>
      </ContentCard>
    </PageContainer>
  );
}
