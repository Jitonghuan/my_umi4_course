import React, { useState, useEffect, useContext } from 'react';
import { ContentCard } from '@/components/vc-page-content';
import PageContainer from '@/components/page-container';
import HeaderTabs from '../_components/header-tabs';
import { Select } from 'antd';
import { getRequest } from '@/utils/request';
import LineChart from './line-chart';
import RankList from './rank-list';
import * as HOOKS from '../hooks';
import './index.less';
import { SelectValue } from 'antd/lib/select';
import * as APIS from '../service';

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

const dataDemo = {
  qualityPoints: {
    data: [
      {
        name: '邮件营销',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '联盟广告',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '直接访问',
        type: 'line',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '搜索引擎',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  codeLines: {
    data: [
      {
        name: '邮件营销',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '联盟广告',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '直接访问',
        type: 'line',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '搜索引擎',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  codeBugs: {
    data: [
      {
        name: '邮件营销',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '联盟广告',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '直接访问',
        type: 'line',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '搜索引擎',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  utPassRate: {
    data: [
      {
        name: '邮件营销',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '联盟广告',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '直接访问',
        type: 'line',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '搜索引擎',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  codeDuplicationsRate: {
    data: [
      {
        name: '邮件营销',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '联盟广告',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '直接访问',
        type: 'line',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '搜索引擎',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  utCovRate: {
    data: [
      {
        name: '邮件营销',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '联盟广告',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '直接访问',
        type: 'line',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '搜索引擎',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
};

export default function Overview(props: any) {
  const [ranking] = HOOKS.useAllRanking();
  const [allAppServices] = HOOKS.useAllAppServices();
  // const [appTrendMap] = HOOKS.useAppTrendMap();

  const [selectedApp, setSelectedApp] = useState<SelectValue>(['ALL']);
  const [appTrendMap, setAppTrendMap] = useState<any>(dataDemo);

  const getEchartData = () => {
    console.log('onblur');
    let appList = selectedApp as any[];
    appList = appList.length > 0 ? appList : ['ALL'];
    getRequest(APIS.getTrend, { data: { apps: appList } }).then((res) => {
      console.log(res);
      let source = {} as any;
      Object.keys(dataDemo).map((k) => {
        console.log(k);
        source[k] = { data: [], xAxis: [] };
        source[k]['xAxis'] = [];
        source[k]['data'] = res.data[k];
        source[k]['data']['type'] = 'line';
        res.data[k].length > 0
          ? res.data[k].map((item: any) => {
              item['type'] = 'line';
            })
          : null;
        source[k]['xAxis'] = res.data[k].length > 0 ? res.data[k][0].xAxis : [];
      });
      setAppTrendMap(source);
    });
  };

  return (
    <PageContainer className="quality-control-overview">
      <HeaderTabs activeKey="overview" history={props.history} />
      <ContentCard>
        <label>
          应用服务:
          <Select
            className="app-service-select"
            placeholder="请选择"
            mode="tags"
            options={allAppServices}
            onChange={(value) => {
              setSelectedApp(value);
            }}
            onBlur={() => {
              getEchartData();
            }}
          />
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
