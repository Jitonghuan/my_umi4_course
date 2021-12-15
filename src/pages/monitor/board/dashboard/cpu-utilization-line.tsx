// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
import { getRequest } from '@/utils/request';
import * as APIS from './service';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function CpuUsingLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const config = {
    data,
    // padding:[10,10,20,20],
    xField: 'time',
    yField: 'precentage',
    seriesField: 'category',
    xAxis: {
      type: 'time',
      // tickCount: 5,
    },
    // yAxis: {
    //   label: {
    //     // 数值格式化为千分位
    //     formatter: (v:any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
    //   },
    // },
    smooth: true,
    width: 550,
    height: 260,
  };

  return (
    <section
    // data-loading={loading}
    >
      <header>
        <h3>cpu利用率折线图</h3>
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
