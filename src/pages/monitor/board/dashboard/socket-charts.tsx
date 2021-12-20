// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React, { useMemo, useState, useEffect } from 'react';
import { Line, Scatter, Mix } from '@ant-design/charts';
import { getRequest } from '@/utils/request';
import * as APIS from './service';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function LoadUsingLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  const config = {
    data,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      // tickInterval:6,
      // tickCount:20
    },
    yAxis: {
      label: {
        // 数值格式化为带百分号
        // formatter: (v:any) => `${v}%`,
        formatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    // width: 550,
    height: 260,
  };

  return (
    <section data-loading={loading}>
      <header>
        <h3>TCP连接数（Count）</h3>
        <span>周期：15s</span>
        <span style={{ marginLeft: 10 }}>聚合方式：Average</span>
      </header>
      <div>
        {/* <div style={{ height: 'calc(100% - 120px)' }}>
          <ColorContainer roleKeys={['color']}> */}
        <Line {...config} />
        {/* </ColorContainer>
        </div> */}
      </div>
    </section>
  );
}
