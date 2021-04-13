import React, { useCallback, useState } from 'react';
import { Tabs, Card } from 'antd';

import MatrisPageContent from '@/components/matris-page-content';
import VCCardLayout from '@cffe/vc-b-card-layout';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
import {
  queryEnvLists,
  queryResUseData,
  queryNodeUseData,
  queryUseMarketData,
} from './service';

import './index.less';

export interface IProps {
  /** 属性描述 */
  [key: string]: any;
}

type ITab = {
  /** key */
  key: string;

  /** title */
  title: string | React.ReactNode;
};

type ICard = {
  mode?: '1' | '2'; // 1 为资源使用率，2 为方块节点数
  /** 标题 */
  title: string;
  /** 值 */
  value?: string;
  /** 单位 */
  unit?: string;
  /** 警示 */
  warn?: string;
  /** 颜色 */
  color?: string;
  /** 方块显示数据源 */
  dataSource?: ICard[];
};

const mockTabData = [
  { key: '1', title: '浙一医院1' },
  { key: '2', title: '天台医院2' },
  { key: '3', title: '浙一医院3' },
  { key: '4', title: '天台医院4' },
  { key: '5', title: '浙一医院5' },
  { key: '6', title: '天台医院6' },
  { key: '7', title: '浙一医院7' },
  { key: '8', title: '天台医院8' },
  { key: '9', title: '浙一医院9' },
  { key: '10', title: '天台医院10' },
];

const mockCardData: ICard[] = [
  { title: 'CPU使用率', value: '63', unit: '%' },
  { title: '内存使用率', value: '63', unit: '%' },
  {
    title: '磁盘使用率',
    value: '80',
    unit: '%',
    warn: '容量不足',
    color: 'orange',
  },
  {
    mode: '2',
    dataSource: [
      { title: '节点数', value: '80' },
      { title: 'POD数', value: '56' },
      { title: 'Deployment数', value: '80' },
      { title: '告警数', value: '80', color: 'orange' },
    ],
  },
];

const mockMarketData: IMarket[] = [{ name: 'ApiServer' }, { name: 'Node' }];

const gridData = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 4,
  xxl: 4,
  xxxl: 4,
};

const { ColorContainer } = colorUtil.context;

// 大盘数据结构
type IMarket = {
  name: string;
};

/**
 * Board
 * @description 监控面板
 * @create 2021-04-12 19:13:58
 */
const Coms = (props: IProps) => {
  const [tabData, setTabData] = useState<ITab[]>(mockTabData);
  const [cardDataLists, setCardDataLists] = useState<ICard[]>(mockCardData);
  const [useMarket, setUseMarket] = useState<IMarket[]>(mockMarketData);

  // 查询

  const getChartOptions: any = useCallback(
    (title: string, percent: number | string, color?: string) => {
      const percentNum = Number(percent);
      const options = {
        grid: {
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '90%'],
            label: {
              show: false,
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2,
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: percentNum,
                name: title,
                itemStyle: { color: color || '#4BA2FF' },
              },
              {
                value: 100 - percentNum,
                name: '空余',
                itemStyle: { color: '#F0F2F5' },
              },
            ],
          },
        ],
      };

      return options;
    },
    [],
  );

  // 顶部的 card
  const renderCard = (record: ICard) => {
    const {
      mode = '1',
      title,
      value = '-',
      unit = '',
      dataSource = [],
    } = record;

    return mode === '1' ? (
      <Card className="monitor-card-item">
        <h4 className="monitor-card-item-title">{title}</h4>
        <div className="monitor-card-item-content">
          <span className="monitor-card-item-val">
            {value || '-'}
            {unit || ''}
          </span>
          <div className="monitor-card-item-chart">
            <ColorContainer roleKeys={['color']}>
              <EchartsReact option={getChartOptions(title, value)} />
            </ColorContainer>
          </div>
        </div>
      </Card>
    ) : (
      <Card className="mode-table" bodyStyle={{ padding: '16px' }}>
        {dataSource.map((el) => (
          <div className="mode-table-item">
            <h4 className="title">{el.title}</h4>
            <div className="value" style={{ color: el.color }}>
              {el.value || '-'}
              {el.unit || ''}
            </div>
          </div>
        ))}
      </Card>
    );
  };

  return (
    <MatrisPageContent className="monitor-board">
      <Card className="monitor-board-content">
        <Tabs type="card" className="monitor-tabs">
          {tabData.map((el) => (
            <Tabs.TabPane key={el.key} tab={el.title} />
          ))}
        </Tabs>

        <div className="monitor-tabs-content">
          <h3 className="monitor-tabs-content-title">资源使用情况</h3>
          <div className="monitor-tabs-content-sec">
            <VCCardLayout grid={gridData}>
              {cardDataLists.map((el) => renderCard(el))}
            </VCCardLayout>
          </div>

          <h3 className="monitor-tabs-content-title">已安装大盘</h3>
          <div className="monitor-tabs-content-sec">
            {useMarket.map((el) => (
              <span className="monitor-market-item">{el.name}</span>
            ))}
          </div>
        </div>
      </Card>
    </MatrisPageContent>
  );
};

export default Coms;
