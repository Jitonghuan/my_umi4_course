// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { Select } from 'antd';
import './index.less';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function DiskUsageLineChart(props: ChartCaseListProps) {
  const { data, loading } = props;

  const config = {
    data,
    xField: 'time',
    yField: 'precentage',
    seriesField: 'category',
    color: ['#8bc0d6', '#60d7a7'],
    xAxis: {
      // tickInterval:6,
      // tickCount:20
    },
    title: 'fs writes/reads',
    yAxis: {
      title: {
        text: '磁盘使用率',
      },
      label: {
        // 数值格式化
        formatter: (v: any) => `${v}`,
      },
    },
    width: 550,
    height: 260,
  };

  return (
    <section data-loading={loading} style={{ marginLeft: 10 }}>
      <header>
        <h3 className="disk-line-section-header">
          <span>磁盘使用折线图 </span>
          <span>
            <Select style={{ width: 140 }}></Select>
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
