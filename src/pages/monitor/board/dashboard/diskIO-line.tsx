// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Area } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';

export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function DiskIOLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const config = {
    data,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    color: ['green', '#8bc0d6'],
    LegendCfg: {
      legend: {
        position: 'top-left',
      },
    },
    // yAxis: {
    //   label: {
    //     // 数值格式化为带百分号
    //     formatter: (v:any) => `${v}%`,
    //   },
    // },
    width: 550,
    height: 260,
  };

  return (
    <section
    // data-loading={loading}
    >
      <header>
        <h3>磁盘读写</h3>
      </header>
      <div>
        <div style={{ height: 'calc(100% - 120px)' }}>
          <ColorContainer roleKeys={['color']}>
            <Area {...config} />
          </ColorContainer>
        </div>
      </div>
    </section>
  );
}
