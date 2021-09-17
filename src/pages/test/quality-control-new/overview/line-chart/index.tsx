import React, { useMemo } from 'react';
import { EchartsReact, colorUtil } from '@cffe/fe-datav-components';

const { ColorContainer } = colorUtil.context;

export interface LineChartProps {
  loading?: boolean;
  title: string;
  data: any[];
  xAxis: string[];
}

export default function LineChart(props: LineChartProps) {
  const {
    loading,
    title = '折线图堆叠',
    data = [
      {
        name: '邮件营销',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '联盟广告',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: '视频广告',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: '直接访问',
        type: 'line',
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: '搜索引擎',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
    xAxis = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  } = props;

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
        top: '80px',
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
  }, []) as any;

  return (
    <section style={{ width: 500 }} data-loading={loading}>
      <div style={{ height: 350, background: '#fff' }}>
        <ColorContainer roleKeys={['color']}>
          <EchartsReact option={chartOptions} />
        </ColorContainer>
      </div>
    </section>
  );
}
