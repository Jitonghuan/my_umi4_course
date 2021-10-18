import React, { useMemo, useEffect, useState } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';

const { ColorContainer } = colorUtil.context;

export interface LineChartProps {
  loading?: boolean;
  title: string;
  data: any[];
  xAxis: string[];
}

export default function LineChart(props: LineChartProps) {
  const { loading, title, data, xAxis } = props;

  const legendLineNum = data.length / 5 + (data.length % 5 ? 1 : 0);

  const chartOptions = useMemo(() => {
    return {
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: data.map((item) => item.name),
        top: '35px',
        left: 'center',
      },
      grid: {
        top: `${80 + legendLineNum * 20}px`,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis,
      },
      yAxis: {
        type: 'value',
      },
      series: data,
    };
  }, [data, xAxis]) as any;

  return (
    <section style={{ width: 500 }} data-loading={loading}>
      <div style={{ height: 330 + legendLineNum * 20, background: '#fff' }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={chartOptions} notMerge={true} lazyUpdate={false} />
        </ColorContainer>
      </div>
    </section>
  );
}
