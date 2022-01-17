// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { Select } from 'antd';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function VolumeChangeLineChart(props: ChartCaseListProps) {
  const { data, loading } = props;

  const config = {
    data,
    xField: 'time',
    yField: 'precentage',
    seriesField: 'category',
    color: ['#8bc0d6'],
    xAxis: {
      // tickInterval:6,
      // tickCount:20
    },
    title: 'fs writes/reads',
    yAxis: {
      title: {
        text: 'cores',
      },
      label: {
        // 数值格式化
        formatter: (v: any) => `${v}`,
      },
    },
    width: 550,
    height: 260,
    padding: 20,
  };

  return (
    <section data-loading={loading} style={{ paddingLeft: 18 }}>
      <header>
        <h3 className="volume-line-section-header">
          <span>volume变化趋势图 </span>
          <span>
            <Select style={{ width: 140 }}></Select>
          </span>
        </h3>
      </header>
      <div>
        <div className="volume-change-line-Chart">
          <ColorContainer roleKeys={['color']}>
            <Line {...config} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
