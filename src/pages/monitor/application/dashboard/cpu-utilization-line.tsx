// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function CpuUsingLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const config = {
    data,
    xField: 'time',
    yField: 'precentage',
    seriesField: 'category',
    // color: ['#8bc0d6', '#60d7a7', 'yellow'],
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
        // 数值格式化为带百分号
        formatter: (v: any) => `${v}`,
      },
    },
    width: 550,
    height: 260,
  };

  return (
    <section data-loading={loading} style={{ marginLeft: 10 }}>
      <header>
        <h3>Pods CPU usage</h3>
      </header>
      <div>
        <div style={{ height: 'calc(100% - 120px)' }}>
          <ColorContainer roleKeys={['color']}>
            <Line {...config} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
