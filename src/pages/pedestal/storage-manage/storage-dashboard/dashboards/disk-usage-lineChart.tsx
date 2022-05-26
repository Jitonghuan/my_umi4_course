// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { Select } from '@cffe/h2o-design';
import './index.less';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
  clusterCode: string;
  queryChartData: (clusterCode: any, date: any) => void;
}
const { ColorContainer } = colorUtil.context;
export default function DiskUsageLineChart(props: ChartCaseListProps) {
  const { data, loading, clusterCode, queryChartData } = props;
  const [currentTime, setCurrentTime] = useState<number>(7);
  const config = {
    data,
    xField: 'time',
    yField: 'precentage',
    seriesField: 'category',
    color: ['#60d7a7', '#8bc0d6'],
    xAxis: {
      // tickInterval:6,
      // tickCount:20
    },

    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.category, value: datum.precentage + 'G' };
      },
    },
    title: 'fs writes/reads',
    yAxis: {
      title: {
        text: '磁盘使用量 /G',
      },
      label: {
        // 数值格式化
        formatter: (v: any) => `${v}G`,
      },
    },
    width: 550,
    height: 260,
  };
  const timeRanger = [
    { label: '7天', value: 7 },
    { label: '15天', value: 15 },
    { label: '30天', value: 30 },
  ];
  const selectTimeRanger = (value: number) => {
    setCurrentTime(value);
    queryChartData(clusterCode, value);
  };

  return (
    <section data-loading={loading} style={{ marginLeft: 30 }}>
      <header>
        <h3 className="disk-line-section-header">
          <span>磁盘使用折线图 </span>
          <span>
            <Select
              style={{ width: 140 }}
              options={timeRanger}
              value={currentTime}
              onChange={selectTimeRanger}
            ></Select>
          </span>
        </h3>
      </header>
      <div>
        <div className="dashboard-disk-usage-line">
          <ColorContainer roleKeys={['color']}>
            <Line {...config} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
