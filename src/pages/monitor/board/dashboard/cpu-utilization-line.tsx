// data formatter
// @author JITONGHUAN <muxi@come-future.com>
// @create 2021/08/09 10:30

import React from 'react';
import { Line } from '@ant-design/charts';
import { colorUtil } from '@cffe/fe-datav-components';
export interface ChartCaseListProps {
  data: any;
  loading?: boolean;
}
const { ColorContainer } = colorUtil.context;
export default function CpuUsingLine(props: ChartCaseListProps) {
  const { data, loading } = props;
  console.log('datarevier:', data);
  const config = {
    data,
    xField: 'time',
    yField: 'precentage',
    seriesField: 'category',
    xAxis: {
      // tickInterval:6,
      // tickCount:20
    },
    yAxis: {
      label: {
        // 数值格式化为带百分号
        formatter: (v: any) => `${v}%`,
      },
    },
    width: 550,
    height: 260,
  };

  return (
    <section data-loading={loading}>
      <header>
        <h3>cpu利用率</h3>
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
