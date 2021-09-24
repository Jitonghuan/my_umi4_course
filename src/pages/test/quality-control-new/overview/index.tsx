import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Select } from 'antd';
import { getRanking } from '../service';
import { getRequest } from '@/utils/request';
import LineChart from './line-chart';
import RankList from './rank-list';
import * as HOOKS from '../hooks';
import './index.less';

const rankListTmp = [
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

const lineChartTmp = [
  {
    title: '代码质量分master分支',
    key: 'qualityPoints' as 'qualityPoints',
  },
  {
    title: '代码量master',
    key: 'codeLines' as 'codeLines',
  },
  {
    title: '千行代码问题数master分支',
    key: 'codeBugs' as 'codeBugs',
  },
  {
    title: '单测成功率',
    key: 'utPassRate' as 'utPassRate',
  },
  {
    title: '代码重复度master分支',
    key: 'codeDuplicationsRate' as 'codeDuplicationsRate',
  },
  {
    title: '单测覆盖率',
    key: 'utCovRate' as 'utCovRate',
  },
];

export default function Overview(props: any) {
  const [ranking] = HOOKS.useAllRanking();
  const [allAppServices] = HOOKS.useAllAppServices();
  const [appTrendMap] = HOOKS.useAppTrendMap();

  return (
    <PageContainer className="quality-control-overview">
      <HeaderTabs activeKey="overview" history={props.history} />
      <ContentCard>
        <label>
          应用服务: <Select className="app-service-select" placeholder="请选择" mode="tags" options={allAppServices} />
        </label>
        <div className="line-chart-group">
          {lineChartTmp.map((item, index) => (
            <LineChart {...item} {...appTrendMap[item.key]} key={index} />
          ))}
        </div>
        <div className="rank-list-group">
          {rankListTmp.map((item, index) => (
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
